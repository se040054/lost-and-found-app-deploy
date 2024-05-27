import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Container, Image } from "react-bootstrap";
import { useState } from "react";
import Swal from "sweetalert2";
export default function ImageInput({
  id,
  defaultImage,
  useRef,
  label,
  isRequired,
}) {
  const [image, setImage] = useState(defaultImage);
  const handleChange = (file) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxFileSize = 5 * 1024 * 1024; // 最大圖片大小為 5 MB
    // 檢查圖片類型
    if (!validImageTypes.includes(file.type)) {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "無效的圖片類型",
      });
      throw new Error("無效的圖片類型。請選擇 JPG、PNG 或 GIF 格式的圖片。");
    }

    // 檢查圖片大小
    if (file.size > maxFileSize) {
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "error",
        title: "文件大小超過 5 MB",
      });
      throw new Error("文件大小超過 5 MB。");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      // 將圖片 src 替換為 DataURL
      setImage(reader.result);
      const Toast = Swal.mixin({
        toast: true,
        position: "bottom",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "上傳成功",
      });
    };
  };
  return (
    <>
      <Row>
        <Col md="12">
          <Form.Group as={Col} md="12" className="text-start">
            <Form.Label htmlFor={id}>{label}</Form.Label>
            <Form.Control
              ref={useRef || null}
              className="mb-3 input-rows"
              id={id}
              accept="image/*"
              type="file"
              onChange={(e) => {
                try {
                  handleChange(e.target.files[0]);
                  e.target.classList.add("is-valid");
                  e.target.classList.remove("is-invalid");
                } catch (error) {
                  e.target.value = null;
                  setImage(defaultImage);
                  e.target.classList.remove("is-valid");
                  e.target.classList.add("is-invalid");
                }
              }}
              required={isRequired || false}
            />
            <Container className="m-0 p-0 text-center">
              <Form.Label htmlFor={id} style={{ cursor: "pointer" }}>
                <Image
                  alt="avatar"
                  id="avatar-preview"
                  src={image}
                  roundedCircle
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              </Form.Label>
            </Container>

            <>
              <Form.Control.Feedback
                type="invalid"
                id={`${id}-feedback-invalid`}
              >
                上傳失敗
              </Form.Control.Feedback>
            </>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}
