import axios from "axios";
import { useState } from "react";
import { FiCheck, FiMusic, FiWifiOff, FiVolume2, FiUsers, FiShield, FiExternalLink } from "react-icons/fi";

const SubscriptionPage = () => {
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planType) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: "premium",
      title: "Premium Individual",
      price: "10,000đ",
      popular: true,
      features: [
        { icon: <FiMusic />, text: "Nghe nhạc không quảng cáo" },
        { icon: <FiWifiOff />, text: "Phát nhạc mọi nơi - kể cả offline" },
        { icon: <FiVolume2 />, text: "Chất lượng âm thanh cao" },
        { icon: <FiCheck />, text: "Tải nhạc về nghe không cần mạng" }
      ],
      buttonVariant: "primary"
    },
    {
      id: "family",
      title: "Premium Family",
      price: "20,000đ",
      popular: false,
      features: [
        { icon: <FiUsers />, text: "6 tài khoản Premium riêng biệt" },
        { icon: <FiShield />, text: "Kiểm soát của phụ huynh" },
        { icon: <FiCheck />, text: "Tất cả tính năng của gói Individual" },
        { icon: <FiCheck />, text: "Tiết kiệm hơn so với mua riêng lẻ" }
      ],
      buttonVariant: "secondary",
      note: "Cho tối đa 4 thành viên"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 font-sans pb-16 px-4">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-green-900/30 to-emerald-900/30 mb-10 rounded-xl backdrop-blur-sm border border-green-900/50">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-4">
          Nâng cấp trải nghiệm âm nhạc
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Mở khóa toàn bộ thư viện nhạc với chất lượng cao nhất. Hủy bất kỳ lúc nào.
        </p>
      </div>

      {/* Plans Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gray-800/80 w-full sm:w-[380px] p-8 rounded-xl shadow-lg transition-all duration-300 
                ${hoveredPlan === plan.id ? "scale-105 shadow-2xl" : "scale-100"} 
                ${plan.popular ? "border-2 border-emerald-500" : "border border-gray-700"}`}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-5 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                  PHỔ BIẾN NHẤT
                </div>
              )}
              
              <div className="border-b border-gray-700 pb-5 mb-5">
                <h2 className="text-2xl font-bold text-white mb-2">{plan.title}</h2>
                <p className="text-4xl font-bold text-white mb-1">
                  {plan.price}
                  <span className="text-base font-normal text-gray-400">/tháng</span>
                </p>
                <p className="text-sm text-gray-400">Đã bao gồm VAT</p>
                {plan.note && <p className="text-sm text-gray-400 mt-1">{plan.note}</p>}
              </div>
              
              <ul className="mb-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="text-emerald-400 mr-2 mt-0.5">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center
                  ${plan.buttonVariant === "primary" 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-emerald-500/30" 
                    : "border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white"}
                  ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ĐANG XỬ LÝ...
                  </>
                ) : (
                  `CHỌN GÓI ${plan.title.toUpperCase()}`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto bg-gray-800/50 p-8 rounded-xl border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Câu hỏi thường gặp</h3>
          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-semibold text-lg text-gray-200 mb-2">Chấp nhận thanh toán ngân hàng nào?</h4>
              <p className="text-gray-400 mb-3">
                Chúng tôi hỗ trợ thanh toán qua VietQR từ tất cả các ngân hàng liên kết.
              </p>
              <a 
                href="https://vietqr.co/banks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-emerald-400 hover:underline"
              >
                Xem danh sách ngân hàng hỗ trợ <FiExternalLink className="ml-1" />
              </a>
            </div>
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-semibold text-lg text-gray-200 mb-2">Tôi có thể hủy gói bất kỳ lúc nào không?</h4>
              <p className="text-gray-400">Có, bạn có thể hủy gói đăng ký bất kỳ lúc nào và tiếp tục sử dụng đến hết kỳ hiện tại.</p>
            </div>
            <div className="border-b border-gray-700 pb-4">
              <h4 className="font-semibold text-lg text-gray-200 mb-2">Tôi có thể đổi gói khác không?</h4>
              <p className="text-gray-400">Bạn có thể nâng cấp hoặc hạ cấp gói bất kỳ lúc nào, thay đổi sẽ có hiệu lực từ chu kỳ thanh toán tiếp theo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;