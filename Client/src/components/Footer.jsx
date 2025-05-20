import React from "react";
import Heading from "./Ui/Heading";

const Footer = () => {
  return (
    <div className="flex justify-between p-6 mb-12">
      <Heading>TripMates</Heading>
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <p>About Us</p>
          <p>Download apps</p>
          <p>Become a guide</p>
          <p>Careers</p>
          <p>Contact</p>
        </div>
        <div>@ by Suyash Nagar. All rights reserved</div>
      </div>
    </div>
  );
};

export default Footer;
