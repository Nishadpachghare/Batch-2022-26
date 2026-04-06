const DEFAULT_CLASSMATES = Array.from({ length: 75 }, (_, index) => {
  const number = index + 1;

  return {
    _id: `fallback-${number}`,
    roll: String(number).padStart(3, "0"),
    name: `Classmate ${number}`,
    image: `https://picsum.photos/seed/student${number}/300/400`,
    year: ["1st yr", "2nd yr", "3rd yr", "4th yr"][index % 4],
    email: "",
  };
});

export default DEFAULT_CLASSMATES;
