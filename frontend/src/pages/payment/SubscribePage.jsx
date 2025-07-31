import axios from "axios";
import "./subscribePage.scss";

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
    <div className="music-premium">
      <div className="hero-section">
        <h1>Nâng cấp trải nghiệm âm nhạc</h1>
        <p>Chọn gói phù hợp với nhu cầu của bạn</p>
      </div>

      <div className="plans-container">
        <div className="plan-cards">
          {/* Premium Individual - Highlighted */}
          <div className="plan-card highlighted">
            <div className="popular-badge">PHỔ BIẾN NHẤT</div>
            <div className="plan-header">
              <h2>Premium Individual</h2>
              <p className="price">10,000đ<span>/tháng</span></p>
              <p className="vat">Đã bao gồm VAT</p>
            </div>
            <div className="plan-features">
              <ul>
                <li>Nghe nhạc không quảng cáo</li>
                <li>Phát nhạc mọi nơi - kể cả offline</li>
                <li>Chất lượng âm thanh cao</li>
                <li>Tải nhạc về nghe không cần mạng</li>
              </ul>
            </div>
            <button 
              className="cta-button primary"
              onClick={() => handleSubscribe("premium")}
            >
              CHỌN GÓI NÀY
            </button>
          </div>

          {/* Family Plan */}
          <div className="plan-card">
            <div className="plan-header">
              <h2>Premium Family</h2>
              <p className="price">20,000đ<span>/tháng</span></p>
              <p className="vat">Đã bao gồm VAT</p>
              <p className="member-count">Cho tối đa 4 thành viên</p>
            </div>
            <div className="plan-features">
              <ul>
                <li>Tất cả tính năng của gói Individual</li>
                <li>6 tài khoản Premium riêng biệt</li>
                <li>Kiểm soát của phụ huynh</li>
                <li>Tiết kiệm hơn so với mua riêng lẻ</li>
              </ul>
            </div>
            <button 
              className="cta-button secondary"
              onClick={() => handleSubscribe("family")}
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