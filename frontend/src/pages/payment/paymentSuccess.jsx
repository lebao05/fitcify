import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./paymentProcess.scss"; 


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
            // Lưu vào localStorage
            localStorage.setItem("lastPaymentSuccess", JSON.stringify(result));
          } else {
            setStatus({
              loading: false,
              success: false,
              message: "Thanh toán thất bại hoặc không hợp lệ",
              orderDetails: null,
            });
          }

          // Ẩn orderCode khỏi URL
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
      // Không có orderCode, kiểm tra localStorage
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
    <div className="payment-confirmation">
      <div className="confirmation-card">
        <div className="confirmation-header">
          <h1>Xác nhận Thanh toán</h1>
          <div className="divider"></div>
        </div>

        {status.loading ? (
          <div className="status-loading">
            <div className="spinner"></div>
            <p>{status.message}</p>
          </div>
        ) : (
          <>
            <div className={`status-indicator ${status.success ? "success" : "error"}`}>
              <div className="icon-wrapper">
                {status.success ? <CheckmarkIcon /> : <CrossIcon />}
              </div>
              <h2>{status.success ? "Thành Công" : "Thất Bại"}</h2>
              {status.success === false && (
                <p className="status-message">{status.message}</p>
              )}
            </div>

            {status.success && status.orderDetails && (
              <div className="order-details">
                <h3>Chi tiết đơn hàng</h3>
                <Detail label="Mã đơn hàng" value={status.orderDetails?.orderCode || "—"} />
                <Detail label="Tên người dùng" value={status.orderDetails?.username} />
                <Detail label="Email" value={status.orderDetails?.email} />
                <Detail
                  label="Gói dịch vụ"
                  value={
                    status.orderDetails?.planType === "premium" ? "Premium" : "Family"
                  }
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
            )}
          </>
        )}

        <div className="action-buttons">
          <button
            className="primary-button"
            onClick={() =>
              (window.location.href = status.success ? "/account" : "/subscribe")
            }
          >
            {status.success ? "Đến trang tài khoản" : "Thử lại"}
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

const Detail = ({ label, value }) => (
  <div className="detail-row">
    <span>{label}:</span>
    <span className="value">{value || "—"}</span>
  </div>
);

const CheckmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor" />
  </svg>
);

const CrossIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
      fill="currentColor"
    />
  </svg>
);

export default PaymentSuccess;
