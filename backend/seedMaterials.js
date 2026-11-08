
require("dotenv").config();

const mongoose = require("mongoose");
const Material = require("./models/Material");

const materials = [
  // DUTCH
  {
    title: "Learn Dutch with NT2 Taalmenu",
    description:
      "Practice Dutch reading, writing, listening and speaking through interactive exercises. Suitable for learners from beginner to advanced levels.",
    category: "Dutch",
    language: "Dutch",
    level: "Beginner",
    type: "practice",
    resourceUrl: "https://nt2taalmenu.nl/",
    sourceName: "NT2 Taalmenu",
    isFree: true
  },
  {
    title: "Self-Study Dutch NT2",
    description:
      "A beginner-friendly Dutch learning resource from TU Delft, with additional grammar, vocabulary and writing materials.",
    category: "Dutch",
    language: "Dutch",
    level: "Beginner",
    type: "course",
    resourceUrl:
      "https://www.tudelft.nl/en/tpm/itav/self-study-languages/self-study-dutch-nt2",
    sourceName: "TU Delft",
    isFree: true
  },
  {
    title: "Interactive Dutch Lessons",
    description:
      "Improve your Dutch through interactive online language lessons and exercises.",
    category: "Dutch",
    language: "Dutch",
    level: "Elementary",
    type: "practice",
    resourceUrl: "https://www.oefenen.nl/",
    sourceName: "Oefenen.nl",
    isFree: true
  },

  // JAPANESE
  {
    title: "IRODORI: Japanese for Life in Japan",
    description:
      "Learn practical Japanese expressions for daily conversations, including listening and speaking activities.",
    category: "Japanese",
    language: "Japanese",
    level: "Beginner",
    type: "course",
    resourceUrl: "https://www.irodori.jpf.go.jp/en/",
    sourceName: "Japan Foundation",
    isFree: true
  },
  {
    title: "Japanese e-Learning Minato",
    description:
      "Explore online Japanese courses, including introductory lessons and Japanese writing systems.",
    category: "Japanese",
    language: "Japanese",
    level: "Beginner",
    type: "course",
    resourceUrl: "https://minato-jf.jp/",
    sourceName: "Japan Foundation",
    isFree: true
  },
  {
    title: "NHK World Learn Japanese",
    description:
      "Improve your Japanese listening and communication skills with lessons and practical expressions.",
    category: "Japanese",
    language: "Japanese",
    level: "Beginner",
    type: "video",
    resourceUrl:
      "https://www3.nhk.or.jp/nhkworld/en/learnjapanese/",
    sourceName: "NHK World",
    isFree: true
  }
];

const seedMaterials = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    for (const material of materials) {
      await Material.findOneAndUpdate(
        {
          title: material.title,
          sourceName: material.sourceName
        },
        material,
        {
          upsert: true,
          new: true,
          runValidators: true
        }
      );
    }

    console.log(
      `${materials.length} learning materials added successfully!`
    );

  } catch (error) {
    console.error("Seeding error:", error.message);

  } finally {
    await mongoose.disconnect();
  }
};

seedMaterials();
