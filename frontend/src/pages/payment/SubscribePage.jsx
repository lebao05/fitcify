import axios from "axios";

const SubscriptionPage = () => {
  const handleSubscribe = async (planType) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/subscribe-create",
        { planType },
        { withCredentials: true }
      );
      const { checkoutUrl } = res.data.Data;
      if (checkoutUrl) window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Subscription failed:", err.response?.data || err.message);
    }
  };
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800 font-inter pb-16 px-4">
      <div className="text-center py-16 bg-blue-50 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
          Nâng cấp trải nghiệm âm nhạc
        </h1>
        <p className="text-lg text-gray-600">
          Chọn gói phù hợp với nhu cầu của bạn
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8">
          <div className="relative bg-white w-full sm:w-[350px] p-8 rounded-xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl border-2 border-blue-400">
            <div className="absolute -top-3 right-5 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              PHỔ BIẾN NHẤT
            </div>
            <div className="border-b pb-5 mb-5">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Premium Individual
              </h2>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                10,000đ
                <span className="text-base font-normal text-gray-500">
                  /tháng
                </span>
              </p>
              <p className="text-sm text-gray-500">Đã bao gồm VAT</p>
            </div>
            <ul className="mb-6 space-y-2 text-sm text-gray-700">
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500">
                Nghe nhạc không quảng cáo
              </li>
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500">
                Phát nhạc mọi nơi - kể cả offline
              </li>
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500">
                Chất lượng âm thanh cao
              </li>
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500">
                Tải nhạc về nghe không cần mạng
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe("premium")}
              className="w-full py-3 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 transition"
            >
              CHỌN GÓI NÀY
            </button>
          </div>

          <div className="bg-white w-full sm:w-[350px] p-8 rounded-xl shadow-md transition-transform hover:-translate-y-1 hover:shadow-xl">
            <div className="border-b pb-5 mb-5">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Premium Family
              </h2>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                20,000đ
                <span className="text-base font-normal text-gray-500">
                  /tháng
                </span>
              </p>
              <p className="text-sm text-gray-500">Đã bao gồm VAT</p>
              <p className="text-sm text-gray-500">Cho tối đa 4 thành viên</p>
            </div>
            <ul className="mb-6 space-y-2 text-sm text-gray-700">
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500">
                Tất cả tính năng của gói Individual
              </li>
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500">
                6 tài khoản Premium riêng biệt
              </li>
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500">
                Kiểm soát của phụ huynh
              </li>
              <li className="pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500">
                Tiết kiệm hơn so với mua riêng lẻ
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe("family")}
              className="w-full py-3 rounded-lg text-blue-500 font-semibold border border-blue-500 hover:bg-blue-50 transition"
            >
              CHỌN GÓI NÀY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
