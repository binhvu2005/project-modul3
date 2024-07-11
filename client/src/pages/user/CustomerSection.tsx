import React, { useState, useEffect, useRef } from 'react';
import '../../css/main.css'
import '../../css/style.css'

const CustomerSection: React.FC = () => {
  const ctmContainerImgRef = useRef<HTMLDivElement>(null);
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const containerImgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const commentRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [counter, setCounter] = useState(2);
  const [counterCmt, setCounterCmt] = useState(1);

  useEffect(() => {
    if (ctmContainerImgRef.current && containerImgRefs.current[1]) {
      ctmContainerImgRef.current.style.transform = `translateX(-${containerImgRefs.current[1].offsetWidth}px)`;
    }
    if (commentContainerRef.current && commentRefs.current[0]) {
      commentContainerRef.current.style.transform = `translateX(-${commentRefs.current[0].offsetWidth}px)`;
    }
  }, []);

  const handleRightClick = () => {
    if (containerImgRefs.current.length - 2 <= counter) {
      return;
    }
    if (ctmContainerImgRef.current && containerImgRefs.current[1]) {
      const widthContainerImg = containerImgRefs.current[1].offsetWidth;
      setCounter(counter + 1);
      ctmContainerImgRef.current.style.transition = 'transform 0.3s';
      ctmContainerImgRef.current.style.transform = `translateX(-${counter * widthContainerImg}px)`;
      custommerActive(counter + 1);
    }

    if (commentContainerRef.current && commentRefs.current[0]) {
      const widthComment = commentRefs.current[0].offsetWidth;
      setCounterCmt(counterCmt + 1);
      commentContainerRef.current.style.transition = 'transform 0.3s';
      commentContainerRef.current.style.transform = `translateX(-${counterCmt * widthComment}px)`;
    }
  };

  const handleLeftClick = () => {
    if (counter <= 1) {
      return;
    }
    if (ctmContainerImgRef.current && containerImgRefs.current[1]) {
      const widthContainerImg = containerImgRefs.current[1].offsetWidth;
      setCounter(counter - 1);
      ctmContainerImgRef.current.style.transition = 'transform 0.3s';
      ctmContainerImgRef.current.style.transform = `translateX(-${(counter - 2) * widthContainerImg}px)`;
      custommerActive(counter - 1);
    }

    if (commentContainerRef.current && commentRefs.current[0]) {
      const widthComment = commentRefs.current[0].offsetWidth;
      setCounterCmt(counterCmt - 1);
      commentContainerRef.current.style.transition = 'transform 0.3s';
      commentContainerRef.current.style.transform = `translateX(-${(counterCmt - 1) * widthComment}px)`;
    }
  };

  const custommerActive = (counter: number) => {
    containerImgRefs.current.forEach((img, idx) => {
      if (img) {
        img.classList.remove('custommer-active', 'custommer-left', 'custommer-right');
      }
    });
    if (containerImgRefs.current[counter]) {
      containerImgRefs.current[counter]!.classList.add('custommer-active');
    }
    if (containerImgRefs.current[counter - 1]) {
      containerImgRefs.current[counter - 1]!.classList.add('custommer-left');
    }
    if (containerImgRefs.current[counter + 1]) {
      containerImgRefs.current[counter + 1]!.classList.add('custommer-right');
    }
  };

  return (
    <div className="custommer">
      <div className="container">
        <div className="row">
          <div className="col-6 center">
            <div className="custommer-header">
              <h2>Khách hàng nói về chúng tôi</h2>
            </div>
            <div className="custommer-wrap">
              <div className="custommer-container" ref={ctmContainerImgRef}>
                <div className="custommer-container-img">
                  {[
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/mc-nguyen-khang-150x150.jpg?alt=media&token=fa173429-e6d8-49fb-bed3-437055a8e7e4',
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/Dien-vien-Manh-Quan-150x150.jpg?alt=media&token=70fc81db-7870-4c1e-b010-2460c36ac0e4',
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/tuan-tien-ti-1-150x150.jpg?alt=media&token=03fd04f9-0e24-47e5-9978-48b959e6b6f3',
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/Tien-si-le-tham-duong-150x150.jpg?alt=media&token=608e191d-2872-4b26-afae-7e585f1c655e',
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/Tun-Pham-150x150.jpg?alt=media&token=ddb6afc4-8a5e-42a8-bc2b-c1fbc2992281',
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/tung-hoa-mi-150x150.jpg?alt=media&token=12345678-8a5e-42a8-bc2b-c1fbc2992281',
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/mc-nguyen-khang-150x150.jpg?alt=media&token=fa173429-e6d8-49fb-bed3-437055a8e7e4',
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/Dien-vien-Manh-Quan-150x150.jpg?alt=media&token=70fc81db-7870-4c1e-b010-2460c36ac0e4',
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/tuan-tien-ti-1-150x150.jpg?alt=media&token=03fd04f9-0e24-47e5-9978-48b959e6b6f3',
                    'https://firebasestorage.googleapis.com/v0/b/ptit-b51c0.appspot.com/o/Tien-si-le-tham-duong-150x150.jpg?alt=media&token=608e191d-2872-4b26-afae-7e585f1c655e',
                  ].map((src, index) => (
                    <div key={index} className={`container-img ${index === 2 ? 'custommer-active' : index === 1 ? 'custommer-left' : index === 3 ? 'custommer-right' : ''}`} id={index === 1 ? 'first' : index === 8 ? 'last' : ''} ref={el => containerImgRefs.current[index] = el}>
                      <div className="custommer-img">
                        <img src={src} alt={`Customer ${index}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <a className="btn-custommer-left" onClick={handleLeftClick}>
                <i className="fas fa-caret-left"></i>
              </a>
              <a className="btn-custommer-right" onClick={handleRightClick}>
                <i className="fas fa-caret-right"></i>
              </a>
            </div>
            <div className="custommer-comment">
              <div className="custommer-comment-container" ref={commentContainerRef}>
                {[
                  { id: 'first-comment', name: 'Diễn viên Mạnh Quân', text: 'Nghề nghiệp chính của tôi là diễn viên, vì thế ngoại hình đóng vai trò rất quan trọng, đặc biệt là về chiều cao. Và các sản phẩm của Smartmen khiến tôi rất hài lòng ở công dụng tăng chiều cao mà không hề lộ dáng, lại cực kỳ êm chân khi di chuyển. Chính điều đó giúp tôi tự tin hơn trong mọi hoàn cảnh.' },
                  { id: '', name: 'Streamer Tuấn Tiền Tỉ', text: 'Giày Smartmen mang kiểu dáng trẻ trung, năng động, êm, bền đẹp. Đế cao su rất nhẹ, chắc chân, lại giúp cao từ 3 – 5cm. Giày da bò chất lượng, được bảo hành tận 12 tháng mà giá lại còn hợp lý. Là đàn ông, hãy cao bằng giày của Smartmen để nâng tầm nhìn của mình các Sếp ạ.' },
                  { id: '', name: 'Tiến sĩ Lê Thẩm Dương', text: 'Tôi hài lòng đến mức tuyệt đối ở dịch vụ. Tôi đến với Smartmen đầu tiên ở sự giải thích, chăm sóc và sau đó là toàn bộ quá trình hậu mãi. Chất lượng, dịch vụ, chăm sóc là 3 điểm tuyệt vời mà tôi muốn chia sẻ với các bạn về Smartmen' },
                  { id: '', name: 'Vlogger Tun Phạm', text: 'Mình rất thích sử dụng giày Smartmen vì thiết kế trẻ trung, năng động nhất là những mẫu giày thể thao. Mình có thể dễ dàng lựa chọn được nhiều mẫu giày phù hợp với độ tuổi và phong cách.' },
                  { id: '', name: 'BLV Tùng Họa Mi', text: 'đầu, mình ấn tượng đến Smartmen là nhờ qua đặc điểm giày cao. Bởi với mình, chiều cao là yếu tố khá quan trọng và nó đập ngay vào mắt người đối diện. Bản thân mình nhận thấy, Smartmen dần dần cải tiến thêm nhiều yếu tố khác để sản phẩm đạt chất lượng tốt hơn.' },
                  { id: '', name: 'MC Nguyên Khang', text: 'Theo cảm nhận của Nguyên Khang thì Smartmen là một lựa chọn rất là tuyệt vời dành cho các nam giới trong việc chăm sóc đôi chân của mình. Bạn sẽ có nhiều sự lựa chọn khi đến với Smartmen, từ những đôi giày thể thao đến giày tây. Và Khang thì Khang chọn Smartmen và Khang cũng hy vọng quý vị và các bạn sẽ lựa chọn được một sản phẩm ưng ý khi đến với Smartmen.' },
                  { id: '', name: 'Diễn viên Mạnh Quân', text: 'Nghề nghiệp chính của tôi là diễn viên, vì thế ngoại hình đóng vai trò rất quan trọng, đặc biệt là về chiều cao. Và các sản phẩm của Smartmen khiến tôi rất hài lòng ở công dụng tăng chiều cao mà không hề lộ dáng, lại cực kỳ êm chân khi di chuyển. Chính điều đó giúp tôi tự tin hơn trong mọi hoàn cảnh.' },
                  { id: 'last-comment', name: 'Streamer Tuấn Tiền Tỉ', text: 'Giày Smartmen mang kiểu dáng trẻ trung, năng động, êm, bền đẹp. Đế cao su rất nhẹ, chắc chân, lại giúp cao từ 3 – 5cm. Giày da bò chất lượng, được bảo hành tận 12 tháng mà giá lại còn hợp lý. Là đàn ông, hãy cao bằng giày của Smartmen để nâng tầm nhìn của mình các Sếp ạ.' },
                ].map((comment, index) => (
                  <div key={index} className="comment" id={comment.id} ref={el => commentRefs.current[index] = el}>
                    <h3>{comment.name}</h3>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSection;
