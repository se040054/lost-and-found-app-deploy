import { Col, Form, Row } from "react-bootstrap";

export default function SelectInput({
  items,
  text,
  label,
  id,
  useRef,
  defaultValue,
}) {
  return (
    <>
      <Form.Group as={Col} md="12" className="mb-3">
        <Form.Label htmlFor={id}>{label}</Form.Label>
        <Form.Select
          id={id}
          ref={useRef || null}
          defaultValue={defaultValue}
          aria-label="select"
        >
          <option disabled>{text}:</option>
          <option value="">不選擇</option>
          {items.map((item) => {
            return <option value={item.id}>{item.name}</option>;
          })}
        </Form.Select>{" "}
      </Form.Group>
    </>
  );
}
