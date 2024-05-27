import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

export default function FormInput({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  invalidPrompt,
  invalidPrompt2,
  minlength,
  maxlength,
  useRef,
  needFeedback = true,
  defaultValue,
  asTextarea,
  isRequired,
}) {
  return (
    <Row>
      <Form.Group as={Col} md="12">
        <Form.Label htmlFor={id}>{label}</Form.Label>
        <Form.Control
          ref={useRef || null}
          className="mb-3 input-rows"
          id={id}
          as={asTextarea && "textarea"}
          type={type}
          placeholder={placeholder || null}
          defaultValue={defaultValue || null}
          value={value}
          onChange={(e) => {
            onChange?.(e);
          }}
          minLength={minlength || null}
          maxLength={maxlength || null}
          required={isRequired || false}
        />
        {needFeedback && (
          <>
            <Form.Control.Feedback id={`${id}-feedback-valid`}>
              OK!
            </Form.Control.Feedback>
            <Form.Control.Feedback type="invalid" id={`${id}-feedback-invalid`}>
              {invalidPrompt}
            </Form.Control.Feedback>
            {invalidPrompt2 && (
              <Form.Control.Feedback
                type="invalid"
                id={`${id}-feedback-invalid`}
              >
                {invalidPrompt2}
              </Form.Control.Feedback>
            )}
          </>
        )}
      </Form.Group>
    </Row>
  );
}
