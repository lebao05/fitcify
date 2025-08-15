import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiCheck, FiX, FiArrowRight, FiHome, FiMail, FiPhone } from "react-icons/fi";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const orderCode = params.get("orderCode");
  const hasCalled = useRef(false);
  const [status, setStatus] = useState({
    loading: true,
    success: null,
    message: "Đang xác nhận thanh toán...",
    orderDetails: null,
  });

  useEffect(() => {
    if (orderCode && !hasCalled.current) {
      hasCalled.current = true;

      axios
        .get(`http://localhost:5000/api/payment/payment-success?orderCode=${orderCode}`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            const result = {
              message: res.data.Message || "Thanh toán thành công",
              orderDetails: res.data.Data || null,
            };
            setStatus({
              loading: false,
              success: true,
              ...result,
            });
            localStorage.setItem("lastPaymentSuccess", JSON.stringify(result));
          } else {
            setStatus({
              loading: false,
              success: false,
              message: "Thanh toán thất bại hoặc không hợp lệ",
              orderDetails: null,
            });
          }

          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, "", cleanUrl);
        })
        .catch((err) => {
          console.error("Payment confirmation error:", err);
          setStatus({
            loading: false,
            success: false,
            message: err.response?.data?.Message || "Lỗi xác nhận thanh toán",
            orderDetails: null,
          });
        });
    } else if (!orderCode) {
      const cached = localStorage.getItem("lastPaymentSuccess");
      if (cached) {
        const parsed = JSON.parse(cached);
        setStatus({
          loading: false,
          success: true,
          message: parsed.message,
          orderDetails: parsed.orderDetails,
        });
      } else {
        setStatus({
          loading: false,
          success: false,
          message: "Không tìm thấy thông tin đơn hàng",
          orderDetails: null,
        });
      }
    }
  }, [orderCode]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const formatDateTime = (isoString) =>
    new Date(isoString).toLocaleString("vi-VN");

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-2">
              Xác nhận Thanh toán
            </h1>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-4"></div>
          </div>

          {status.loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-gray-300">{status.message}</p>
            </div>
          ) : (
            <>
              <div className={`flex flex-col items-center justify-center py-6 ${status.success ? "text-emerald-400" : "text-red-400"}`}>
                <div className="rounded-full p-4 bg-gray-700/50 mb-4">
                  {status.success ? (
                    <FiCheck className="w-12 h-12" />
                  ) : (
                    <FiX className="w-12 h-12" />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {status.success ? "Thành Công" : "Thất Bại"}
                </h2>
                {status.success === false && (
                  <p className="text-gray-300 text-center max-w-md">{status.message}</p>
                )}
              </div>

              {status.success && status.orderDetails && (
                <div className="bg-gray-700/30 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                    Chi tiết đơn hàng
                  </h3>
                  <div className="space-y-3">
                    <Detail label="Mã đơn hàng" value={status.orderDetails?.orderCode || "—"} />
                    <Detail label="Tên người dùng" value={status.orderDetails?.username} />
                    <Detail label="Email" value={status.orderDetails?.email} />
                    <Detail
                      label="Gói dịch vụ"
                      value={status.orderDetails?.planType === "premium" ? "Premium Individual" : "Premium Family"}
                    />
                    <Detail
                      label="Phương thức thanh toán"
                      value={status.orderDetails?.paymentMethod}
                    />
                    <Detail
                      label="Số tiền"
                      value={formatCurrency(status.orderDetails?.amount)}
                    />
                    <Detail
                      label="Ngày bắt đầu"
                      value={formatDateTime(status.orderDetails?.startDate)}
                    />
                    <Detail
                      label="Ngày kết thúc"
                      value={formatDateTime(status.orderDetails?.endDate)}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                status.success
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
              onClick={() =>
                (window.location.href = status.success ? "/account" : "/subscribe")
              }
            >
              {status.success ? "Đến trang tài khoản" : "Thử lại"}
              <FiArrowRight />
            </button>
            <button
              className="flex-1 py-3 rounded-lg font-semibold border border-gray-600 hover:bg-gray-700/50 text-white flex items-center justify-center gap-2 transition-all"
              onClick={() => (window.location.href = "/")}
            >
              Về trang chủ
              <FiHome />
            </button>
          </div>

          <div className="text-center text-gray-400 border-t border-gray-700 pt-6">
            <p className="mb-2">Cần hỗ trợ?</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a 
                href="mailto:support@musicapp.com" 
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <FiMail /> fitcify@musicapp.com
              </a>
              <span className="flex items-center gap-2">
                <FiPhone /> 0342 434 874
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-400">{label}:</span>
    <span className="text-white font-medium">{value || "—"}</span>
  </div>
);

export default PaymentSuccess;