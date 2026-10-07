import bgImage from "@/assets/images/bg-hero.jpeg";

const BackgroundImage = ({ className = "" }) => {
  return (
    <div
      className={`bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    />
  );
};

export default BackgroundImage;
