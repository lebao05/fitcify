import { useEffect, useMemo, useState } from "react";
import { getAccountInfo, updateAccountInfo } from "../../services/userApi";
import { useNavigate } from "react-router-dom";

const MONTHS = [
  { value: 1, label: "Tháng Một" },
  { value: 2, label: "Tháng Hai" },
  { value: 3, label: "Tháng Ba" },
  { value: 4, label: "Tháng Tư" },
  { value: 5, label: "Tháng Năm" },
  { value: 6, label: "Tháng Sáu" },
  { value: 7, label: "Tháng Bảy" },
  { value: 8, label: "Tháng Tám" },
  { value: 9, label: "Tháng Chín" },
  { value: 10, label: "Tháng Mười" },
  { value: 11, label: "Tháng Mười Một" },
  { value: 12, label: "Tháng Mười Hai" },
];
const GENDERS = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
];
const yearsRange = (start = 1940, end = new Date().getFullYear()) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export default function AccountPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [form, setForm] = useState({
    email: "",
    gender: "",
    day: "",
    month: "",
    year: "",
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // popup
  const [showSuccess, setShowSuccess] = useState(false);

  const emailValid = useMemo(() => {
    if (!form.email) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim().toLowerCase());
  }, [form.email]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAccountInfo();
        const { username, email, gender, dateOfBirth } = res?.Data || {};
        setUsername(username || "");
        const d = dateOfBirth ? new Date(dateOfBirth) : null;
        setForm((s) => ({
          ...s,
          email: email || "",
          gender: (gender || "").toLowerCase(),
          day: d ? String(d.getUTCDate()).padStart(2, "0") : "",
          month: d ? String(d.getUTCMonth() + 1) : "",
          year: d ? String(d.getUTCFullYear()) : "",
        }));
      } catch {
        setErr("Không tải được thông tin tài khoản");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const buildDate = (y, m, d) => {
    if (!y || !m || !d) return "";
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!emailValid) {
      setErr("Email không hợp lệ");
      return;
    }

    const payload = {};
    if (form.email) payload.email = form.email.trim().toLowerCase();
    if (form.gender) payload.gender = form.gender;
    const dob = buildDate(form.year, form.month, form.day);
    if (dob) payload.dateOfBirth = dob;

    try {
      const res = await updateAccountInfo(payload);
      if (res.Error) throw new Error(res.Message || "Cập nhật thất bại");

      // hiện popup thành công
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (e2) {
      setErr(e2?.message || "Không thể cập nhật");
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-white/70">Đang tải thông tin…</div>;
  }

  return (
    <div className="px-8 py-10 text-white">
      {/* container giữa màn hình */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-[44px] font-extrabold mb-8">Thông tin cá nhân</h1>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Tên người dùng */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white/80">
              Tên người dùng
            </label>
            <input
              type="text"
              value={username}
              readOnly
              className="w-full bg-[#1f1f1f] border border-[#2a2a2a] rounded-md p-3 text-white opacity-80 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white/80">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full bg-[#121212] border border-[#2a2a2a] rounded-md p-3 focus:outline-none focus:border-white transition"
              placeholder="you@example.com"
            />
            {!emailValid && (
              <p className="text-red-400 text-xs mt-1">Email không hợp lệ</p>
            )}
          </div>

          {/* Giới tính */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white/80">
              Giới tính
            </label>
            <div className="relative">
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                className="w-full appearance-none bg-[#121212] border border-[#2a2a2a] rounded-md p-3 pr-10 focus:outline-none focus:border-white transition"
              >
                <option value="">-- Chọn --</option>
                {GENDERS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                ▾
              </span>
            </div>
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-white/80">
              Ngày sinh
            </label>
            <div className="grid grid-cols-12 gap-3">
              <input
                name="day"
                type="number"
                min={1}
                max={31}
                value={form.day}
                onChange={onChange}
                placeholder="21"
                className="col-span-3 bg-[#121212] border border-[#2a2a2a] rounded-md p-3 focus:outline-none focus:border-white transition"
              />
              <div className="col-span-5 relative">
                <select
                  name="month"
                  value={form.month}
                  onChange={onChange}
                  className="w-full appearance-none bg-[#121212] border border-[#2a2a2a] rounded-md p-3 pr-10 focus:outline-none focus:border-white transition"
                >
                  <option value="">Tháng</option>
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                  ▾
                </span>
              </div>
              <div className="col-span-4 relative">
                <select
                  name="year"
                  value={form.year}
                  onChange={onChange}
                  className="w-full appearance-none bg-[#121212] border border-[#2a2a2a] rounded-md p-3 pr-10 focus:outline-none focus:border-white transition"
                >
                  <option value="">Năm</option>
                  {yearsRange(1940).reverse().map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                  ▾
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-full border border-white text-white hover:bg-white/10 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#1db954] hover:bg-[#19a64d] text-black font-semibold transition"
            >
              Lưu hồ sơ
            </button>
          </div>

          {err && <div className="text-red-400 text-sm">{err}</div>}
        </form>
      </div>

      {/* Popup Success */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-[2000]">
          <div className="bg-[#181818] border border-[#2a2a2a] rounded-xl p-6 w-[320px] text-center">
            <h3 className="text-lg font-semibold mb-2">Thành công</h3>
            <p className="text-white/80 mb-4">Đã lưu hồ sơ</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="px-4 py-2 rounded-full bg-[#1db954] hover:bg-[#19a64d] text-black font-semibold transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
