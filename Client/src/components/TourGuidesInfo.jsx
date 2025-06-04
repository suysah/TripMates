import Heading from "./Ui/Heading";

const TourGuidesInfo = ({ guides }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div>
      <div className="flex  flex-col  items-start  gap-3">
        <Heading>YOUR TOUR GUIDES</Heading>
        {guides.map((guide, index) => {
          return (
            <div className="flex flex-col gap-3 pt-2" key={index}>
              <div className="flex justify-center items-center gap-3 text-gray-600">
                <img
                  src={`${BASE_URL}/users/${guide.photo}`}
                  className="h-8 w-8 object-cover rounded-full"
                />
                <span className="font-bold text-black">
                  {guide.role.toUpperCase()}
                </span>{" "}
                {guide.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TourGuidesInfo;
