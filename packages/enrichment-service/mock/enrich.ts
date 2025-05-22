import { AttributeType } from "@prisma/client";

import { config } from "dotenv";
import { enrichment } from "../lib/prompts/enrichment/enrichment";

config();

const webContent =
  "Koka Silk Instant Rice Fettuccine is a gluten-free noodle product that offers a smooth, silken texture combined with flavorful broths. These noodles are free from added MSG, preservatives, and artificial coloring, making them a healthier choice for those seeking a lighter meal. ([kokanoodles.com](https://kokanoodles.com/koka-silk/?utm_source=openai))\n" +
  "\n" +
  "**Available Flavors:**\n" +
  "\n" +
  "- **Curry Flavour:** Features a blend of spices including coriander, turmeric, chili, cumin, fennel, cinnamon, black pepper, and star anise, complemented by coconut powder, sugar, yeast extract, hydrolyzed soy protein, ginger, lemongrass, and paprika. Garnished with dehydrated bell pepper and chives. ([dunnesstoresgrocery.com](https://www.dunnesstoresgrocery.com/product/koka-silk-gluten-free-instant-rice-fettuccine-curry-flavour-70g-100220306?utm_source=openai))\n" +
  "\n" +
  "- **Chicken Flavour:** Contains seasoning made from rapeseed oil, salt, sugar, yeast extract, hydrolyzed soy protein, onion, chives, ginger, and turmeric, with garnishes of dehydrated corn and chives. ([dunnesstoresgrocery.com](https://www.dunnesstoresgrocery.com/sm/delivery/rsid/526/product/koka-silk-gluten-free-instant-rice-fettuccine-chicken-flavour-70g-id-100220300?utm_source=openai))\n" +
  "\n" +
  "- **Seafood Flavour:** Includes seasoning with salt, sugar, yeast extract, hydrolyzed soy protein, onion, chives, ginger, and turmeric, garnished with dehydrated corn and chives. ([amazon.in](https://www.amazon.in/Koka-Gluten-Fettuccine-Seafood-Flavour/dp/B07GJYK2DR?utm_source=openai))\n" +
  "\n" +
  "**Nutritional Information (per 100g):**\n" +
  "\n" +
  "- **Energy:** 217 kJ (52 kcal)\n" +
  "- **Fat:** 0.8g\n" +
  "- **Saturated Fat:** 0.2g\n" +
  "- **Carbohydrate:** 10.2g\n" +
  "- **Sugars:** 0.4g\n" +
  "- **Protein:** 0.9g\n" +
  "- **Salt:** 0.8g\n" +
  "\n" +
  "**Preparation Instructions:**\n" +
  "\n" +
  "1. Place the rice fettuccine into 400ml of boiling water and cook for 2 minutes.\n" +
  "2. Turn off the heat, add the seasoning, and stir.\n" +
  "3. Transfer to a bowl, add garnishes, and serve.\n" +
  "\n" +
  "**Storage:** Store in a cool, dry place.\n" +
  "\n" +
  "Koka Silk Instant Rice Fettuccine is suitable for vegetarians and halal-certified, making it a versatile option for various dietary preferences. ([kokanoodles.com](https://kokanoodles.com/koka-silk/?utm_source=openai))";

const attributes = [
  {
    id: "1",
    name: "Item Weight",
    type: AttributeType.MEASURE,
    description: "This is the weight of the product",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: ["G", "KG"],
  },
  {
    id: "2",
    name: "Ingredients",
    type: AttributeType.LONG_TEXT,
    description: "This is the ingredients of the product",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: [],
  },
  {
    id: "3",
    name: "Product Description",
    type: AttributeType.HTML,
    description: "This is the description of the product",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: [],
  },
  {
    id: "4",
    name: "Storage Requirements",
    type: AttributeType.SINGLE_SELECT,
    description: "This is the weight of the product",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: [
      "Dry Storage",
      "Deep Frozen",
      "Ambient Storage",
      "Frozen Food Storage",
    ],
  },
  {
    id: "5",
    name: "Items per Package",
    type: AttributeType.NUMBER,
    description:
      "This is the number of items in the package, sometimes products can have multiple sub pieces. This refers to the sub piece count.",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: ["G", "KG"],
  },
  {
    id: "6",
    name: "Color",
    type: AttributeType.SHORT_TEXT,
    description: "This is the color of the product",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: [],
  },
  {
    id: "7",
    name: "Material",
    type: AttributeType.SHORT_TEXT,
    description: "This is the material of the product",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: [],
  },
  {
    id: "8",
    name: "Width",
    type: AttributeType.MEASURE,
    description: "This is the width of the product",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: ["MM", "CM"],
  },
  {
    id: "9",
    name: "Height",
    type: AttributeType.MEASURE,
    description: "This is the height of the product",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: ["MM", "CM"],
  },
  {
    id: "10",
    name: "Warranty",
    type: AttributeType.NUMBER,
    description: "This is the warranty year of the product",
    enrichmentInstructions: "",
    selectOptions: [],
    measureUnits: [],
  },
];

const productName = "Instant rice fettuccine";

export const main = async () => {
  const res = await enrichment({
    productName,
    ocrContent: "",
    webSearchResults: webContent,
    attributesToEnrich: attributes,
  });
  console.dir(res, { depth: null });
};

main();
