import { useState } from "react";
import Heading from "../components/Ui/Heading";
import ModalAddUpdate from "../components/Ui/ModalAddUpdate";

const Billing = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="h-screen flex justify-center items-center">
      <ModalAddUpdate isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Heading>this feature is currently unavailable!</Heading>
      </ModalAddUpdate>
    </div>
  );
};

export default Billing;
