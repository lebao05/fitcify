import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./paymentProcess.scss"; 

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
    <div className="payment-confirmation">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <h1>Huỷ Thanh Toán</h1>
          <div className="divider"></div>
        </div>

        {status.loading ? (
          <div className="status-loading">
            <div className="spinner"></div>
            <p>{status.message}</p>
          </div>
        ) : (
          <div className="status-indicator error">
            <div className="icon-wrapper">
              <CrossIcon />
            </div>
            <h2>Thất Bại</h2>
            <p className="status-message">{status.message}</p>
          </div>
        )}

        <div className="action-buttons">
          <button
            className="primary-button"
            onClick={() => (window.location.href = "/subscribe")}
          >
            Thử lại thanh toán
          </button>
          <button
            className="secondary-button"
            onClick={() => (window.location.href = "/")}
          >
            Về trang chủ
          </button>
        </div>

        <div className="support-section">
          <p>Cần hỗ trợ?</p>
          <a href="mailto:support@musicapp.com">fitcify@musicapp.com</a>
          <span>Hotline: 0342 434 874</span>
        </div>
      </div>
    </div>
  );
};

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
      fill="currentColor"
    />
  </svg>
);

export default PaymentCancel;
