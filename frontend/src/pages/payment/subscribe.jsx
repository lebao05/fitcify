import axios from "axios";
import "./subscribe.scss";

const SubscriptionPage = () => {
  const handleSubscribe = async (planType) => {
    try {
        const res = await axios.post("/api/subscribe-create", { planType },
        { withCredentials: true }
        );
      window.location.href = res.data.checkoutUrl; // chuyển sang PayOS
    } catch (err) {
      console.error("Đăng ký thất bại:", err);
      alert("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="subscription-container">
      <h1>Chọn gói đăng ký</h1>

      <div className="plan-list">
        <div className="plan-card">
          <h2>Premium</h2>
          <p>Nghe nhạc không giới hạn trong 30 ngày.</p>
          <button onClick={() => handleSubscribe("premium")}>
            Đăng ký Premium
          </button>
        </div>

        <div className="plan-card">
          <h2>Family</h2>
          <p>Gói gia đình cho 4 tài khoản, 30 ngày sử dụng.</p>
          <button onClick={() => handleSubscribe("family")}>
            Đăng ký Family
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
