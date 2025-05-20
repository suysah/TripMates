import React from "react";
import Heading from "./Ui/Heading";

const AboutTour = ({ description }) => {
  return (
    <div className="flex flex-col items-start gap-4">
      <Heading>ABOUT THE PARK CAMPER TOUR</Heading>
      <p className="text-left">{description}</p>
      {/* <p className="text-left">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dignissimos,
        sint facilis molestiae assumenda at est fuga vero. Suscipit veniam dolor
        eius, iusto inventore ipsam sunt saepe cupiditate atque maxime fugiat.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
        nesciunt eum consectetur minus impedit, velit aliquam corrupti amet
        harum exercitationem pariatur, culpa fugit veniam quibusdam? Ut nam
        molestiae veniam a.
      </p> */}
    </div>
  );
};

export default AboutTour;
