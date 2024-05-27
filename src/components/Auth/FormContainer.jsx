// import { useState } from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";

export default function FormContainer({
  children,
  //, handleSubmitExtend
}) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    //  handleSubmitExtend();
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      {children}
    </Form>
  );
}
