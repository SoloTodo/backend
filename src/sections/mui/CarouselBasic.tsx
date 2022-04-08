import { useState } from "react";
// @mui
import { Card } from "@mui/material";
// components
import Image from "../../components/Image";
import { CarouselArrowIndex } from "../../components/carousel";

// ----------------------------------------------------------------------

export default function CarouselBasic({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(images.length - 1);
    }
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  return (
    <Card>
      <Image
        alt={images[currentIndex]}
        src={images[currentIndex]}
        ratio="1/1"
      />

      <CarouselArrowIndex
        index={currentIndex}
        total={images.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </Card>
  );
}
