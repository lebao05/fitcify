import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiX, FiArrowRight, FiHome, FiMail, FiPhone } from "react-icons/fi";

const PaymentCancel = () => {
  const [params] = useSearchParams();
  const orderCode = params.get("orderCode");
  const hasCalled = useRef(false);

  const [status, setStatus] = useState({
    loading: true,
    message: "Đang huỷ thanh toán...",
  });

  useEffect(() => {
    if (orderCode && !hasCalled.current) {
      hasCalled.current = true;

      axios
        .get(`/api/payment/payment-cancel?orderCode=${orderCode}`, {
          withCredentials: true,
        })
        .then((res) => {
          const result = {
            message: res.data.Message || "Thanh toán đã bị huỷ.",
          };
          setStatus({ loading: false, ...result });
          localStorage.setItem("lastPaymentCancel", JSON.stringify(result));

          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, "", cleanUrl);
        })
        .catch((err) => {
          console.error("❌ Lỗi huỷ thanh toán:", err);
          const result = {
            message: "Đã xảy ra lỗi khi huỷ thanh toán.",
          };
          setStatus({ loading: false, ...result });
          localStorage.setItem("lastPaymentCancel", JSON.stringify(result));

          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, "", cleanUrl);
        });
    } else if (!orderCode) {
      const cached = localStorage.getItem("lastPaymentCancel");
      if (cached) {
        const parsed = JSON.parse(cached);
        setStatus({ loading: false, ...parsed });
      } else {
        setStatus({
          loading: false,
          message: "Không tìm thấy thông tin đơn hàng bị huỷ.",
        });
      }
    }
  }, [orderCode]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300 mb-2">
              Huỷ Thanh Toán
            </h1>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-4"></div>
          </div>

          {status.loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-300">{status.message}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-red-400">
              <div className="rounded-full p-4 bg-gray-700/50 mb-4">
                <FiX className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Thất Bại</h2>
              <p className="text-gray-300 text-center max-w-md">{status.message}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              className="flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white flex items-center justify-center gap-2 transition-all"
              onClick={() => (window.location.href = "/subscribe")}
            >
              Thử lại thanh toán
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

export default PaymentCancel;