import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

export default function DateInput({
  id,
  label,
  useRef,
  defaultValue,
  asTextarea,
  isRequired,
  min,
  max,
}) {
  function formatDate(date) {
    // node 時間已經為UTC+8
    console.log(date);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // 月份從0開始 要+1
    const day = date.getUTCDate();
    return `${year}-${month}-${day}`;
  }

  return (
    <Row>
      <Form.Group as={Col} md="12">
        <Form.Label htmlFor={id}>{label}</Form.Label>
        <Form.Control
          ref={useRef || null}
          className="mb-3 input-rows"
          id={id}
          as={asTextarea && "textarea"}
          type="date"
          defaultValue={defaultValue || null}
          required={isRequired || false}
          min={min || null}
          max={max || null}
        />
      </Form.Group>
    </Row>
  );
}
