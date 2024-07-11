
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../../css/main.css"
import "../../css/style.css"

const Footer = () => {
  return (
    <div>
      <div className="home-banner">
        <div className="container">
          <a href="https://www.google.com/maps/place/H%E1%BB%8Dc+vi%E1%BB%87n+C%C3%B4ng+ngh%E1%BB%87+B%C6%B0u+ch%C3%ADnh+vi%E1%BB%85n+th%C3%B4ng/@20.9809035,105.784863,17z/data=!3m1!4b1!4m6!3m5!1s0x3135accdd8a1ad71:0xa2f9b16036648187!8m2!3d20.9809035!4d105.7874379!16s%2Fg%2F12168p16?entry=ttu">Xem địa chỉ hệ thống đại lý & Showroom</a>
        </div>
      </div>

      <div className="contact">
        <div className="container">
          <div className="row">
            <div className="col-3 contact-content">
              <h4>HỖ TRỢ KHÁCH HÀNG</h4>
              <p>Hướng dẫn chọn size</p>
              <p>Chính sách khách hàng</p>
              <p>Câu hỏi thường gặp</p>
            </div>
            <div className="col-3 contact-content">
              <h4>Về chúng tôi</h4>
              <p>Giới thiệu</p>
              <p>Liên hệ</p>
            </div>
            <div className="col-3 contact-content">
              <h4>Hệ thống cửa hàng</h4>
              <p>Hệ thống 10 cửa hàng</p>
            </div>
            <div className="col-3 contact-content">
              <h4>Fanpage chúng tôi</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer container-fluid bg-footer">
        <p>
          © 2020 Bản quyền thuộc về MEN. - Thiết kế website trọn gói bởi Bình đẹp zai
        </p>
      </div>
    </div>
  );
};

export default Footer;
