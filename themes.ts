
import { ThemeCategory, Theme } from "./types";

export const RANDOM_THEME_VALUE = '__RANDOM__';
export const CANNABIS_RANDOM_VALUE = '__CANNABIS_RANDOM__';
export const SPORTS_CARD_VALUE = '__SPORTS_CARD__';
export const LOGO_RANDOM_VALUE = '__LOGO_RANDOM__';
export const MOVIE_POSTER_VALUE = '__MOVIE_POSTER__';
export const HALLOWEEN_VALUE = '__HALLOWEEN__';
export const MOVIE_POSTER_FLYER_VALUE = '__MOVIE_POSTER_FLYER__';
export const MOVIE_POSTER_PREMIERE_VALUE = '__MOVIE_POSTER_PREMIERE__';
export const CUSTOM_FOOD_VALUE = '__CUSTOM_FOOD__';

export const CATEGORY_RANDOM_PREFIX = '__RANDOM__';
export const createCategoryRandomValue = (categoryId: string) => `${CATEGORY_RANDOM_PREFIX}${categoryId}`;


export const sportsForCard = [
  'Baseball', 'Basketball', 'Football', 'Soccer', 'Hockey', 'Golf', 'Tennis', 'Racing'
];

export const halloweenCostumeSuggestions = [
    'Spooky Ghost',
    'Classic Vampire',
    'Fuzzy Spider',
    'Adorable Bat',
    'Scary Shark',
    'Majestic Lion',
    'Funny Hot Dog',
    'Busy Bee',
    'Magical Unicorn',
    'Fearsome Dinosaur',
    'Cute Teddy Bear',
    'Lucky Ladybug',
    'Wise Old Owl',
    'Mischievous Devil',
    'Angelic Angel',
    'Brave Firefighter',
    'Brilliant Doctor',
    'Swashbuckling Pirate',
    'Dapper Tuxedo',
    'Colorful Peacock',
    'Clumsy Clown',
    'Fluffy Sheep',
    'Royal King',
    'Royal Queen',
    "Toasted S'more"
];

export const activityThemes: Theme[] = [
  {
    title: "Maze Mania",
    prompt: "Create a full-page, greyscale coloring book activity page featuring a fun, moderately difficult maze. The maze should show the dog from the photo trying to get to a central goal. The goal and the decorative elements around the maze should be themed around: '{baseTheme}'. The final image MUST be a portrait 8.5:11 aspect ratio, with clean lines and artistic shading, ready for coloring.",
    isSpecial: true,
    category: 'activity',
  }
];


// -- SPECIAL THEME CATEGORIES --

export const cannabisThemes: Theme[] = [
  {
    title: "Amsterdam Tourist",
    prompt: "The dog is sitting at a tiny table outside a classic Amsterdam 'coffeeshop' right next to a picturesque canal. A half-eaten space cake and a cup of coffee are on the table. A bicycle with a basket full of tulips is leaning against the wall.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Art Deco Dank",
    prompt: "A glamorous 1920s Art Deco style portrait. The dog's form is simplified into sleek, geometric lines and sharp angles, framed by a symmetrical sunburst. The decorative elements are stylized cannabis leaves, rendered in the same sharp, metallic Art Deco fashion.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Blunt-Rolling Master",
    prompt: "A zen-like focus on craftsmanship. An extreme close-up shot focusing on the dog's paws, which are expertly and meticulously rolling a perfect, comically large blunt on a stylish rolling tray with all the necessary accessories.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "The Bodega Dog",
    prompt: "The dog is the chill, all-knowing owner behind the counter of a classic New York-style bodega. The shelves are packed with parody snack brands ('Pup-Ritos,' 'Squeak-a-Cola'). A single, perfectly rolled joint is tucked behind their ear like a pencil. The scene is bathed in the warm glow of the store's lights at night.",
    isSpecial: true,
    category: 'cannabis',
    badge: 'Popular',
  },
  {
    title: "Canna-Chemist's Lab",
    prompt: "A scientific, mad scientist scene. The dog is a brilliant chemist in a lab coat and safety goggles, surrounded by complex laboratory glassware. They are carefully using an eyedropper to add a drop of glowing green liquid to a beaker, creating a plume of colorful smoke.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Cannabis Bud Mandala",
    prompt: "A spiritual, mandala-style design with the dog's serene face as the central focus. Radiating outwards are intricate, symmetrical, repeating patterns of cannabis leaves, THC molecule structures, and the detailed floral geometry of cannabis buds.",
    isSpecial: true,
    category: 'cannabis',
    badge: 'Trending',
  },
  {
    title: "Cannabis Cubism",
    prompt: "An abstract, cubist interpretation of the dog's face. The portrait is deconstructed into geometric facets and multiple viewpoints, with some facets showing textures of cannabis buds or leaf veins, creating a complex, modern art piece.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Canine Connoisseur",
    prompt: "A whimsical and sophisticated take on a modern 'budtender.' The dog is behind the counter of a fantastical shop where glass jars are filled with magical, glowing dog treats with funny names like 'Golden Retriever's Delight' and 'Zoomie Zkittlez.'",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "The Conspiracy Theorist",
    prompt: "The dog is in a messy basement, wearing a tinfoil hat. Behind them is a huge corkboard covered in newspaper clippings, photos, and yarn, connecting mailmen, squirrels, and vacuum cleaners to a central, mysterious drawing of a cannabis leaf.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Cosmic Canine's Quest",
    prompt: "An out-of-this-world, stoner-space-adventure. The dog is an astronaut, floating in a galaxy where the planets are shaped like gummy bear edibles and brownies. Comets with smoky tails drift by, and constellations form the shape of a cannabis leaf.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Cosmic Ganja Galaxy",
    prompt: "A celestial space scene. The dog's face is a glowing constellation. The background is a deep space galaxy where nebulas are shaped like smoke clouds, planets are patterned like cannabis buds, and comets trail smoke.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Couch-Locked Philosopher",
    prompt: "The dog is completely melted into a comfy couch, staring intently at a lava lamp. A half-eaten bag of chips is on their chest. A philosophy book is open upside-down on the floor. A thought bubble above their head contains a complex physics equation that simply resolves to a drawing of a squeaky toy.",
    isSpecial: true,
    category: 'cannabis',
    badge: "@Charlies.CEO's favorite",
  },
  {
    title: "Dab Rig Dragon Slayer",
    prompt: "A high-fantasy take on modern cannabis concentrates. The dog is a valiant knight in shining armor, wielding a giant dab tool and bravely facing a friendly, cartoonish dragon who is breathing a gentle flame to heat up a massive, ornate, magical-looking dab rig.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "DJ Dank-Beats",
    prompt: "A lo-fi, hip-hop producer's creative zone. The dog is a music producer in a cozy, vibe-lit recording studio, wearing oversized headphones and tapping on an MPC drum machine. The sound waves from the speakers are visualized as wavy, artistic smoke trails.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "The Dogfather",
    prompt: "A classic mobster movie scene. The dog is 'The Dogfather,' styled like a mafia boss in a pinstripe suit and fedora, relaxing in a plush leather armchair in a dimly lit, wood-paneled back room. A massive, smoldering blunt is held near its mouth like a cigar.",
    isSpecial: true,
    category: 'cannabis',
    badge: 'Hot',
  },
  {
    title: "The Festival Hound",
    prompt: "The dog is at a massive outdoor music festival, wearing a flower crown and a tie-dye bandana, sitting on a blanket. In the background, a huge, trippy stage has a band of other animals playing. A Ferris wheel and tents dot the landscape.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Field of Buds Portrait",
    prompt: "A close-up, blissful portrait of the dog's face. The background is completely filled with a detailed, macro-level pattern of beautiful, crystal-covered cannabis buds, creating a rich, textured 'field of buds' page for coloring.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Furry Friends' Road Trip",
    prompt: "A classic, Cheech & Chong-style buddy comedy. The dog and a funny sidekick (like a squirrel) are in a classic convertible low-rider, filled with oversized bags of snacks, laughing joyfully as they cruise down a road lined with giant, surreal cacti.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "The Gamer's Glaze",
    prompt: "The room is dark, lit only by the glow of a big-screen TV. The dog has a gaming headset on, their eyes wide and glued to the screen, paws on the controller. Empty chip bags and soda cans litter the floor. The game on screen is a parody like 'Call of Doody: Modern Woof-fare'.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Ganja Graffiti Artist",
    prompt: "A street art, urban creativity scene. The dog is a Banksy-style street artist in a hoodie, caught in the act of spray-painting a massive, intricate, and beautifully detailed cannabis leaf mural on a gritty brick wall in a city alleyway.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Green-Thumb Grow-Op",
    prompt: "A master cultivator's secret, high-tech garden. The dog is the master grower, wearing overalls and a trucker hat, proudly tending to massive, prize-winning cannabis plants in a state-of-the-art greenhouse with glowing grow lights and a hydroponic setup.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "High-stronaut's Orbit",
    prompt: "A peaceful space scene. The dog is inside a retro-futuristic spaceship, floating weightlessly and staring out a large bubble window at a beautiful, swirling nebula. A single joint is floating beside them, its smoke trail spiraling elegantly in zero gravity.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Hotbox Hideout",
    prompt: "The dog and a couple of mischievous friends (like a raccoon and a squirrel) are crammed inside a classic, rickety wooden doghouse. The entire doghouse is filled with a comical amount of cartoon smoke pouring out of the doorway. A sign says, 'No Mailmen Allowed!'",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Hotbox Hot Rod",
    prompt: "A West Coast lowrider and car culture scene. The dog is cruising slow and low in a classic convertible with hydraulic switches. The interior of the car is hilariously filled with cartoon smoke billowing out of the windows. The dog wears cool sunglasses and a bandana, cruising a city street at sunset.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Intergalactic Smuggler",
    prompt: "A sci-fi, Star Wars-inspired space opera adventure. The dog is a Han Solo-type rogue, the captain of a beat-up spaceship, leaning back in the cockpit. The cargo hold is packed with vacuum-sealed bags of the galaxy's finest cannabis, and a nebula shaped like a cannabis leaf is visible through the window.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Leaf Canopy Portrait",
    prompt: "A large, beautiful portrait of the dog's face is the central focus. The entire background is a dense, overlapping pattern of various cannabis leaves (indica, sativa). This creates a full page of detailed foliage for coloring, with the dog peeking through.",
    isSpecial: true,
    category: 'cannabis',
    badge: 'Popular',
  },
  {
    title: "Liquid Light Show",
    prompt: "A psychedelic, 1960s liquid light show effect. The dog's form is a clear outline against a background of swirling, melting, lava-lamp-like blobs and patterns. The greyscale patterns should be organic, trippy, and feel like they are in motion.",
    isSpecial: true,
    category: 'cannabis',
    badge: 'New',
  },
  {
    title: "Magical Cannabis Forest",
    prompt: "A fantastical journey through an enchanted, oversized world. The dog is portrayed as tiny, exploring a magical forest where the 'trees' are colossal, glowing cannabis plants. The leaves are large platforms, and the buds are sparkling, crystal-like treasures.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "The Munchie King",
    prompt: "A hilarious, regal scene where the dog is the Munchie King on a majestic throne constructed from giant pizza slices and pretzels. A river of nacho cheese flows nearby, and the castle in the background is made of stacked bags of chips and candy bars.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Munchie Mayhem Portrait",
    prompt: "A funny, close-up portrait of the dog's hungry face. The background is a chaotic and delightful pile of classic stoner snacks - pizza slices, bags of chips, cookies, and tacos - creating a fun, food-themed pattern to color.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Op-Art Overload",
    prompt: "A mind-bending optical art piece. The dog's portrait is the stable center, while the entire background is a dizzying op-art pattern of vibrating lines, checkerboards, and moiré effects that subtly incorporate cannabis leaf silhouettes.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Paisley Puff Palace",
    prompt: "An ornate, mystical, and visually dense scene. The dog is relaxing like a sultan on a pile of plush cushions inside a Middle Eastern-style palace, as a magical hookah emits beautiful, intricate paisley-patterned clouds that fill the room.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Pot-Pup's Magical Bakery",
    prompt: "A baker's dream with a magical green twist. The dog is a chef in a chaotic, magical kitchen, wearing a tall chef's hat and decorating a giant, gooey brownie. Little animated gingerbread men and gummy bears are helping out.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Psychedelic Paisley",
    prompt: "A groovy, 1970s-style portrait where the dog's form is integrated into a dense, swirling paisley pattern. The classic paisley teardrop shapes are cleverly stylized to look like cannabis leaves and plumes of smoke, creating a trippy, flowing, and seamless design.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "The Rasta Rover",
    prompt: "The dog, sporting a cool hat with dreadlocks, is relaxing on the porch of a small shack in a lush, tropical Jamaican setting. They're peacefully strumming a guitar, with a traditional chalice pipe resting on a nearby table.",
    isSpecial: true,
    category: 'cannabis',
    badge: 'Trending',
  },
  {
    title: "Reggae Rover's Beach Jam",
    prompt: "A laid-back, Bob Marley-inspired beach party. The dog, sporting a Rasta-colored beanie and cool sunglasses, is playing a ukulele on a beautiful beach. A friendly sun (also with sunglasses) smiles down, and the palm trees have leaves subtly shaped like cannabis leaves.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "The Skate-Pup Punk",
    prompt: "Decked out in a backward baseball cap and a faded band t-shirt, the dog is chilling at a gritty, graffiti-covered skatepark. They're sitting on their skateboard at the top of a ramp. The graffiti includes artistic cannabis leaves.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Smoke Screen Portrait",
    prompt: "A striking, close-up portrait of the dog's face. The background is completely filled with thick, billowing, and swirling clouds of cartoonish smoke, providing large, smooth, and satisfying areas to be colored in.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Smoke Swirl Line Art",
    prompt: "An elegant, minimalist portrait where the dog's entire form is drawn using a single, continuous, swirling line that emulates a trail of smoke. Within the negative space and the flow of the line, subtle cannabis leaf shapes are formed.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Stained Glass Saint",
    prompt: "A majestic, cathedral-style stained glass window featuring the dog as a serene, haloed figure. The leaded panels in the background are filled with stylized cannabis leaves and geometric smoke patterns. The entire image has bold, black outlines, mimicking traditional stained glass.",
    isSpecial: true,
    category: 'cannabis',
    badge: 'Hot',
  },
  {
    title: "Surrealist Dreamscape",
    prompt: "A surrealist, Salvador Dali-inspired dreamscape. The dog is the central figure, but perhaps its form is melting over a strange object. The background is a bizarre landscape with cannabis motifs in unexpected places, like melting clocks shaped like pot leaves.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "THC Molecule Matrix",
    prompt: "An intelligent-looking portrait of the dog's face. The background is a clean, repeating, geometric pattern of the THC molecule structure, creating a scientific and abstract design that is fun to color.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Trap Lord's Throne",
    prompt: "A modern hip-hop luxury scene. The dog is a trap lord, sitting on a throne made of giant, stacked gold bars and cash, wearing an oversized, iced-out chain with a golden paw print pendant and a designer-parody hoodie. The background is a lavish penthouse apartment overlooking a city, with bags of 'Doggy Purps' cannabis stacked nearby.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Tribal Smoke Signals",
    prompt: "A powerful, abstract design inspired by tribal patterns. The dog's face is composed of bold, black-and-white geometric shapes and lines, similar to Polynesian or Haida art, but the patterns are stylized to represent smoke and cannabis leaves.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Weed Wizard's Lab",
    prompt: "A magical laboratory where the dog is a powerful wizard stirring a bubbling green cauldron. The steam rising from it forms into whimsical shapes like bones and squeaky toys. A spellbook is open to a beautifully illustrated page of a cannabis plant.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Zen Dog's Meditation",
    prompt: "A super chill, psychedelic 70s relaxation scene. The dog is peacefully meditating while floating on a giant, plush mushroom. The background is a swirling vortex of paisley patterns and tie-dye, with bubbling lava lamps and friendly, smiling smoke clouds.",
    isSpecial: true,
    category: 'cannabis',
  },
  {
    title: "Zentangle Leaf",
    prompt: "A detailed portrait of the dog's face, where the entire form—fur, eyes, nose—is rendered in an intricate Zentangle style. The repeating patterns are composed of tiny cannabis leaves, swirling smoke, and stylized bud shapes, creating a hypnotic, textured image.",
    isSpecial: true,
    category: 'cannabis',
    badge: 'New',
  },
];

export const logoThemeCategories: ThemeCategory[] = [
  {
    title: "Apparel & Streetwear",
    description: "Modern, edgy, and cool logos for a clothing brand.",
    subcategories: [
      {
        title: "Streetwear Styles",
        themes: [
          {
            title: "90s Hip-Hop Style",
            prompt: "A logo for a 90s hip-hop streetwear brand. The dog's face is a gritty, stylized icon, maybe with a graffiti-like feel. The provided brand name is in a bold, impactful font, reminiscent of iconic 90s hip-hop group logos like Wu-Tang Clan or Public Enemy.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Gothic Streetwear",
            prompt: "A logo for a gothic, luxury streetwear brand. The dog's head is drawn in a detailed, illustrative style, combined with ornate, gothic elements like blackletter typography, crosses, or filigree. The provided brand name is in a bold, Old English or Blackletter font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Graffiti Tag Logo",
            prompt: "A logo in the style of a street art graffiti tag. The dog's face is a highly stylized, abstract, spray-painted stencil. The provided brand name is written as a flowing, complex graffiti handstyle tag that integrates with the stencil.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Gritty Streetwear Brand",
            prompt: "A gritty, edgy logo for a modern streetwear brand. The dog's face should be a stylized, perhaps slightly aggressive icon. The provided brand name should be in a bold, sans-serif font, possibly in a box logo style similar to popular skate brands.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Hypebeast Collab",
            prompt: "A logo for a high-fashion streetwear collaboration. The design features a stylized, minimalist icon of the dog's face. The provided brand name should be in a clean, sans-serif font inside quotation marks, mimicking a Virgil Abloh/Off-White style.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Japanese Streetwear",
            prompt: "A logo for a Japanese streetwear brand in the Harajuku style. A cute (kawaii), cartoon version of the dog's face is the central character, possibly with large, expressive eyes. The provided brand name is integrated into the design in a playful, bubbly font, perhaps with a mix of English and Japanese-style characters.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Luxury Monogram Pattern",
            prompt: "A logo for a luxury streetwear brand that can be used as a repeating monogram pattern. The dog's head is abstracted into a very simple, elegant, geometric icon. The provided brand name should be a separate wordmark in a clean, high-fashion font. The prompt is for the single logo unit.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Skate Brand Box Logo",
            prompt: "A minimalist, iconic logo for a streetwear skate brand. The dog's face is a simple, high-contrast illustration placed inside a bold, rectangular 'box logo'. The provided brand name is inside the box with the illustration, in a clean, bold, sans-serif font like Futura Bold Italic.",
            isSpecial: true,
            category: 'logo',
            badge: 'Popular',
          },
          {
            title: "Techwear/Gorpcore Logo",
            prompt: "A minimal, technical logo for a techwear brand. The dog's head is an abstract, geometric icon made of clean lines and shapes. The provided brand name is in a clean, sans-serif, utilitarian font, possibly with coordinates or technical specs, reflecting a functional aesthetic.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Vintage Bootleg Rap Tee",
            prompt: "A logo designed for a vintage-style 'bootleg rap' t-shirt. The dog's face is a slightly grainy, high-contrast, airbrushed-style portrait, possibly with sparkles and a dramatic drop shadow. The provided brand name is in a bold, chrome-effect, 90s-style word art font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Y2K Cyber Style",
            prompt: "A logo with a Y2K, futuristic aesthetic. The dog's face is rendered in a sleek, metallic, 3D style with chrome effects and lens flares. The provided brand name is in a bold, futuristic font with a digital, pixelated, or liquid metal feel, popular in the early 2000s.",
            isSpecial: true,
            category: 'logo',
          },
        ],
      },
    ],
  },
  {
    title: "Food & Beverage",
    description: "Deliciously designed logos for culinary brands.",
    subcategories: [
      {
        title: "Restaurants, Cafes, and Breweries",
        themes: [
          {
            title: "Artisan Bakery",
            prompt: "A warm and inviting logo for an artisan bakery. The dog's face is drawn in a friendly, rustic style, wearing a baker's hat. The logo is framed by stalks of wheat. The provided brand name should be in a charming, hand-written font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Artisanal Deli",
            prompt: "A charming, retro logo for an artisanal delicatessen. The dog is drawn in a simple, friendly style, maybe wearing a little bow tie or chef's hat. The logo has a hand-drawn, deli-sign feel, with the provided brand name in a classic script.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Craft Brewery Emblem",
            prompt: "A vintage, emblem-style logo for a craft brewery. The dog's face should be drawn in a bold, simplified, illustrative style and placed centrally within a circle. Flank the circle with classic brewery elements like hops and barley. The provided brand name should be incorporated in a distressed, arched font.",
            isSpecial: true,
            category: 'logo',
            badge: 'Trending',
          },
          {
            title: "Fiesta Cantina",
            prompt: "A festive and colorful logo for a Mexican restaurant. The dog is drawn in a lively style, wearing a sombrero and a mustache. The logo should incorporate vibrant, fiesta-style patterns and the provided brand name in a decorative, rustic font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Gourmet Food Truck",
            prompt: "A fun and friendly logo for a gourmet food truck. The dog is drawn in a simple, happy cartoon style, wearing a chef's hat and peeking over the provided brand name, which is written in a bold, casual, and slightly playful font. Include a simple food truck silhouette.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Hipster Coffee House",
            prompt: "A minimalist, clean, line-art logo for an artisanal coffee roaster. The dog's face should be reduced to its essential lines, creating a sleek silhouette or profile, enclosed in a simple geometric shape like a hexagon. The provided brand name should be incorporated in a clean, sans-serif font.",
            isSpecial: true,
            category: 'logo',
            badge: 'New',
          },
          {
            title: "Minimalist Sushi Bar",
            prompt: "A clean and elegant logo for a modern sushi bar. The dog's face is abstracted into a simple, single-line brush stroke style (like Japanese calligraphy), perhaps with two chopsticks. The provided brand name should be in a simple, minimalist font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Playful Pup Bakery",
            prompt: "A sweet, hand-drawn logo for a pet treat company. The dog's face should be drawn in a cute, cartoonish style with a happy expression, perhaps peeking out from behind a cupcake. The provided brand name should be incorporated in a bubbly, friendly script.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Sweet Scoop Ice Cream",
            prompt: "A fun, retro-style logo for an ice cream parlor. The dog's face is drawn in a happy, cartoon style, perhaps as the 'scoop' on top of an ice cream cone. The provided brand name should be in a playful, rounded script font.",
            isSpecial: true,
            category: 'logo',
          },
        ],
      },
    ],
  },
  {
    title: "Corporate & Professional",
    description: "Sleek and trustworthy logos for any business.",
    subcategories: [
      {
        title: "Business & Services",
        themes: [
          {
            title: "Cozy Bookstore Cafe",
            prompt: "A cozy and intellectual logo for a bookstore cafe. The dog is drawn in a simple, charming style, wearing glasses and sitting on a stack of books. The provided brand name is in a classic, typewriter-style font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Cyberpunk AI Company",
            prompt: "A sleek, futuristic logo for a cyberpunk AI company. The dog's head is abstracted into a glowing, neon-on-black circuit board pattern or a holographic wireframe. The provided brand name is in a clean, digital, monospaced font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Eco-Friendly Brand",
            prompt: "An earthy and organic logo for an eco-friendly brand. The dog's form is created from flowing lines that turn into a leaf or sprout. The logo is enclosed in a rustic, hand-drawn circle. The provided brand name is in a natural, slightly textured font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Heavy Duty Construction",
            prompt: "A strong and rugged logo for a construction company. The dog is drawn as a tough mascot wearing a hard hat, integrated with heavy machinery like an excavator or bulldozer. The provided brand name should be in a heavy, industrial block font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Luxury Fashion Monogram",
            prompt: "An elegant and sophisticated logo for a high-end fashion brand. The dog's features should be abstracted into a very sleek, minimal, almost geometric icon to act as a monogram, placed above the provided brand name which should be in a chic, serif font.",
            isSpecial: true,
            category: 'logo',
            badge: 'Hot',
          },
          {
            title: "Luxury Hotel Crest",
            prompt: "An opulent and high-class logo for a five-star hotel. The dog is represented by a very elegant, abstract gold line-art icon, possibly combined with a crown or star. The provided brand name is in a luxurious, wide-spaced, serif font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Modern Real Estate",
            prompt: "A professional and trustworthy logo for a real estate agency. The dog's silhouette is cleanly integrated into a simple house or key shape. The overall design is very clean, modern, and corporate. The provided brand name is in a strong, reliable, sans-serif font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Modern Tech Startup",
            prompt: "A sharp, intelligent, and geometric logo for a tech company. The dog's head is constructed from clean, interlocking geometric shapes (triangles, circles), creating an abstract but recognizable form. The provided brand name should be incorporated in a crisp, modern, lowercase font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Noir Detective Agency",
            prompt: "A mysterious, film noir-style logo. The dog's silhouette is seen in a fedora, with light coming through window blinds creating shadows. The provided brand name should be in a classic, typewriter-style font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Prestigious Law Firm",
            prompt: "A classic, authoritative logo for a law firm. The dog's face should be drawn in a stately, portrait style, perhaps integrated with scales of justice or a gavel. The provided brand name should be in a strong, traditional serif font like Times New Roman.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Trusty Plumbing Co.",
            prompt: "A reliable and friendly logo for a plumbing service. The dog is drawn as a helpful mascot, wearing a cap and holding a wrench. The logo should be enclosed in a circle or shield with the provided brand name in a bold, clear, sans-serif font.",
            isSpecial: true,
            category: 'logo',
          },
        ],
      },
    ],
  },
  {
    title: "Creative & Entertainment",
    description: "Fun and expressive logos for media and arts.",
    subcategories: [
      {
        title: "Arts & Media",
        themes: [
          {
            title: "16-Bit Indie Game",
            prompt: "A pixel-art logo for an indie video game studio. The dog's head is rendered in a clean, 16-bit pixel art style. The provided brand name is also in a pixelated, retro video game font, giving it a nostalgic and fun feel.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "eSports Team Mascot",
            prompt: "A fierce, dynamic logo for a professional eSports team. The dog's head is drawn as an aggressive mascot with sharp angles, glowing eyes, and a high-tech feel, breaking out of a shield. The provided brand name should be in a futuristic, angular font.",
            isSpecial: true,
            category: 'logo',
            badge: 'Trending',
          },
          {
            title: "The Great Magician",
            prompt: "A dazzling and mysterious logo for a magician. The dog is drawn wearing a top hat, peeking out from behind a curtain, with stars and playing cards floating around. The provided brand name should be in a magical, sparkling font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Gothic Horror Author",
            prompt: "A dark and literary logo in a Gothic horror style. The dog's portrait is moody and mysterious, perhaps with a raven perched on its head. The provided brand name should be in an ornate, spooky, old-English-style font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Heavy Metal Band",
            prompt: "A dark and intense logo for a heavy metal band. The dog's face is drawn in a menacing, highly detailed, black-and-white illustrative style, with sharp teeth and an aggressive look. The provided brand name is in a classic, jagged, almost unreadable metal band font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Indie Record Label",
            prompt: "A cool, minimalist logo for an indie record label. The dog's profile is simplified into a clean icon that is part of a spinning vinyl record. The provided brand name should be in a clean, modern, sans-serif font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Japanese Ukiyo-e",
            prompt: "A logo in the style of a traditional Japanese Ukiyo-e woodblock print. The dog is drawn with flowing, calligraphic lines and flat areas of pattern, perhaps with a stylized wave or cherry blossoms in the background. The provided brand name should be in a font that mimics Japanese brush strokes.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Kids' Learning App",
            prompt: "A bright, bubbly, and colorful logo for a children's educational app. The dog's face is a very simple, friendly, geometric character with big eyes and a smile. The provided brand name is in a rounded, soft, and very readable font, perhaps with a small, cute element like a star or apple integrated.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Kids' Toy Brand",
            prompt: "A fun, colorful, and bubbly logo for a children's toy company. The dog's face is a simple, friendly cartoon character with big eyes. The provided brand name is in a rounded, playful, and slightly goofy font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Old School Tattoo Parlor",
            prompt: "A traditional, American tattoo-style logo. The dog's face is drawn with bold black outlines and a limited color palette, surrounded by classic tattoo elements like roses, anchors, or a banner with the provided brand name.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Punk Rock Band",
            prompt: "A gritty, DIY, zine-style logo for a punk rock band. The dog's face is a high-contrast, photocopied-style stencil. The provided brand name is in a messy, hand-drawn, or ransom-note-style cutout font, all contained within a rough, uneven circle or square.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Retro Arcade",
            prompt: "A vibrant, 80s-style neon logo for a retro arcade. The dog's head is stylized with neon outlines and a 'Tron'-like grid pattern. The provided brand name should be in a chrome, futuristic font from that era.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Sci-Fi Movie Studio",
            prompt: "A grand, cinematic logo for a science fiction movie studio. The dog's majestic silhouette is shown against a backdrop of a swirling galaxy or a futuristic city. The provided brand name should be in a bold, epic, movie-title font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Stand-Up Comedy Club",
            prompt: "A fun and energetic logo for a comedy club. The dog is drawn as a cartoon, laughing hysterically and holding a microphone. The background features a brick wall and a spotlight. The provided brand name should be in a bold, playful font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Synthwave DJ",
            prompt: "A retro 80s Synthwave logo. The dog's head is a neon-outlined silhouette against a backdrop of a glowing grid extending to a digital sunset. The provided brand name should be in a chrome, retro-futuristic font.",
            isSpecial: true,
            category: 'logo',
          },
        ],
      },
    ],
  },
  {
    title: "Lifestyle & Adventure",
    description: "Logos for brands centered on experiences and style.",
    subcategories: [
      {
        title: "Hobbies, Travel, and Outdoors",
        themes: [
          {
            title: "Art Deco Hotel",
            prompt: "A glamorous and symmetrical Art Deco logo, reminiscent of the 1920s. The dog's face is stylized with sharp, geometric lines and elegant curves, framed by a classic Art Deco sunburst or geometric pattern. The provided brand name should be in a tall, stylish, sans-serif font from that era.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Biker Motorcycle Club",
            prompt: "A tough, emblem-style logo for a motorcycle club. The dog's face is drawn in an aggressive, detailed style, possibly with sunglasses, set against a backdrop of flames, wings, or pistons. The provided brand name is in a bold, arched, patch-style font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Botanical Illustrator",
            prompt: "An elegant and detailed logo in the style of a vintage botanical illustration. The dog's face is gently framed by meticulously hand-drawn flowers and leaves, rendered with fine lines and scientific precision. The provided brand name should be in a classic, serif script.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Boutique Florist",
            prompt: "A delicate and beautiful logo for a flower shop. The dog's face is elegantly surrounded by a wreath of hand-drawn, botanical illustrations of flowers and leaves. The provided brand name should be in a graceful, cursive script.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Classic Barbershop",
            prompt: "A classic, vintage emblem for a traditional barbershop. The dog's portrait is a detailed, old-school illustration with a well-groomed mustache. The logo is enclosed in an ornate circle with vintage filigree and features elements like scissors and a comb. The provided brand name is in a classic, serif font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Classic Sports Mascot",
            prompt: "A bold and dynamic logo in the style of a classic American sports team. The dog's face should have a determined, energetic expression, using strong lines and dynamic angles, breaking out of a shield or circle. The provided brand name should be incorporated in a heavy, collegiate-style block font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Crafty Knitting Circle",
            prompt: "A cozy and handmade logo for a knitting or craft brand. The dog's form is charmingly rendered as if it were made of yarn, with button eyes. The logo is framed by crossed knitting needles. The provided brand name should be in a soft, rounded, script-like font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Mystical Apothecary",
            prompt: "An enchanting, magical logo for an apothecary or potion shop. The dog's face is drawn in a mystical style, surrounded by crystals, herbs, and glowing potion bottles. The provided brand name should be in an old-world, gothic, or alchemical font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Nautical Sailing Club",
            prompt: "A preppy, classic logo for a yacht or sailing club. The dog's head is drawn in a clean style, placed inside a crest with crossed oars, an anchor, or a ship's wheel. The provided brand name should be in a timeless, serif font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Old West Saloon",
            prompt: "A rustic, western-themed logo for a saloon. The dog's face is drawn with a cowboy hat and a bandana, framed by swinging saloon doors or a horseshoe. The provided brand name should be in a classic, wood-type western font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Outdoor Adventure Co.",
            prompt: "A rugged, patch-style logo for an outdoor gear company. The dog's portrait should be heroic, looking off into the distance, integrated into a landscape of mountains and pine trees. The provided brand name should be placed in a banner wrapping around the scene.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Retro Speed Shop",
            prompt: "A cool, 1950s-inspired logo for a garage. The dog is drawn in a retro cartoon style, wearing old-fashioned goggles. The logo should have a dynamic, mid-century modern feel, with the provided brand name in a bold, slanted script.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Rustic Farm & Market",
            prompt: "A wholesome and earthy logo with a hand-stamped, woodcut feel for a family farm. The dog's portrait should be simple and friendly, enclosed in a rustic, slightly imperfect circle. The provided brand name should be incorporated. The text 'Est. 2024' can be included for authenticity.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Soothing Wellness Brand",
            prompt: "A calm and gentle logo, perfect for a spa or organic pet care line. The dog's face is drawn with soft, flowing lines in a peaceful, serene pose. The logo uses a circular shape and a delicate leaf element with the provided brand name in a light, airy font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Space Program Mission Patch",
            prompt: "A logo designed as an official NASA-style mission patch. The dog's heroic portrait is in the center, wearing a space helmet. The circular patch includes stars, a planet, and the provided brand name arched around the border in a classic, bold, sans-serif font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Steampunk Inventor",
            prompt: "An imaginative steampunk logo. The dog's portrait is integrated with Victorian-era cogs, gears, and brass pipes. The dog could be wearing a top hat with goggles. The provided brand name should be in an ornate, industrial-revolution-style font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Surf Shop",
            prompt: "A laid-back, sun-bleached logo for a surf shop. The dog is drawn in a cool, relaxed style, wearing sunglasses, with a surfboard and a stylized wave in the background. The provided brand name should be in a distressed, beachy, hand-drawn font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Viking Rune Carver",
            prompt: "A powerful, Nordic-style logo. The dog's face is drawn in a bold, woodcut style, framed by intricate Norse knotwork and runes. The provided brand name should be in a font that mimics ancient Futhark runes.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Vintage Airline",
            prompt: "A classic, mid-century modern logo for an airline. The dog's head is stylized into a sleek, winged emblem, conveying speed and elegance. The provided brand name should be in a clean, retro script font from the golden age of travel.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Zen Yoga Studio",
            prompt: "A serene and minimalist logo for a yoga studio. The dog is drawn in a graceful, single-line art style, forming a peaceful yoga pose (like downward dog). The provided brand name is in a light, elegant, and calming sans-serif font below the icon.",
            isSpecial: true,
            category: 'logo',
          },
        ],
      },
    ],
  },
  {
    title: "Artistic & Niche Styles",
    description: "Highly stylized and unique logos for specialized brands.",
    subcategories: [
      {
        title: "Vintage & Retro Inspired",
        themes: [
          {
            title: "70s Psychedelic Rock",
            prompt: "A groovy, psychedelic logo inspired by 1970s rock concert posters. The dog's face is drawn in a trippy, flowing, illustrative style. The provided brand name is in a bold, bubbly, almost liquid font that is hand-drawn and integrated into the swirling artwork.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Art Nouveau Distillery",
            prompt: "An elegant, luxurious logo in the Art Nouveau style, suitable for a high-end distillery. The dog's portrait is integrated with intricate, flowing, organic lines and floral motifs, reminiscent of Alphonse Mucha. The provided brand name is in a beautiful, custom, period-appropriate serif font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Mid-Century Modern Mascot",
            prompt: "A retro-cool logo in a 1950s/60s Mid-Century Modern animation style. The dog's face is abstracted into simple, clean, geometric shapes with a playful and optimistic feel. The style is very flat and graphic. The provided brand name is in a clean, mid-century sans-serif font.",
            isSpecial: true,
            category: 'logo',
          },
        ],
      },
      {
        title: "Handmade & Illustrative",
        themes: [
          {
            title: "Gentle Children's Book",
            prompt: "A gentle and charming logo in the style of a classic children's book illustration. The dog is drawn with soft ink lines and a warm, friendly expression, reminiscent of Beatrix Potter. The provided brand name is in a classic, friendly serif or script font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Handmade Linocut Stamp",
            prompt: "A rustic, artisanal logo with a hand-carved, linocut block print style. The dog's face is rendered in a high-contrast, black and white style with bold, slightly imperfect lines, giving it a charming, handmade feel. The provided brand name is in a simple, stamped-looking font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Saturday Morning Cartoon",
            prompt: "A fun, friendly logo in the style of a classic 80s/90s Saturday morning cartoon. The dog's face is drawn as a cheerful character with bold, clean outlines and a vibrant personality. The provided brand name is in a bubbly, playful font, possibly inside a colorful burst or shape.",
            isSpecial: true,
            category: 'logo',
          },
        ],
      },
      {
        title: "Modern & Geek Culture",
        themes: [
          {
            title: "Clever Negative Space",
            prompt: "A modern, minimalist, and clever logo that uses negative space. The dog's silhouette is formed by the empty space within or around a simple geometric shape (like a circle or square). The design is intelligent and clean. The provided brand name is in a simple, elegant sans-serif font, separate from the icon.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Fantasy RPG Guild",
            prompt: "A fantasy logo for a D&D-style adventure guild. The dog's head is a heroic mascot on a shield or crest, framed by classic fantasy elements like crossed swords, a scroll, or a D20 die. The provided brand name is in a bold, gothic or uncial fantasy font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Modern Podcast Cover",
            prompt: "A clean, bold, and modern logo designed as cover art for a podcast. It features a simple, graphic icon of the dog's head, possibly combined with a microphone or soundwave element. The provided brand name is the main focus, written in a large, clear, and very readable sans-serif font.",
            isSpecial: true,
            category: 'logo',
          },
          {
            title: "Vibrant Gradient App",
            prompt: "A simple, modern, friendly, geometric icon of the dog's face. The icon itself is a single solid color, but it's designed to be placed on a vibrant gradient background for a modern app (like Instagram). The provided brand name is in a clean, friendly, sans-serif font like Inter.",
            isSpecial: true,
            category: 'logo',
          },
        ],
      },
    ],
  },
];

export const logoThemes: Theme[] = logoThemeCategories.flatMap(category => 
    category.subcategories.flatMap(subcategory => subcategory.themes)
);


export const moviePosterTheme: Theme = {
  title: "Movie Poster Premiere",
  prompt: MOVIE_POSTER_VALUE,
  isSpecial: true,
  category: 'movieposter'
};


export const specialOccasionThemes: Theme[] = [
  {
    title: "Happy Howl-o-ween",
    prompt: HALLOWEEN_VALUE,
    isSpecial: true,
    category: 'halloween'
  },
  {
    title: "Happy Bark-day!",
    prompt: "A festive birthday party scene. The dog is the star, wearing a party hat and sitting in front of a dog-friendly birthday cake with candles. The background is filled with colorful balloons, confetti, presents wrapped in paw-print paper, and a 'Happy Bark-day!' banner.",
    isSpecial: true,
  },
  {
    title: "Rainbow Bridge Memorial",
    prompt: "A beautiful and serene memorial tribute. The dog is depicted as a happy, peaceful angel with soft, ethereal wings and a subtle halo, sitting on a fluffy cloud. The background is a gentle, painterly sky with a vibrant rainbow arching overhead (the Rainbow Bridge). The mood is loving and peaceful, not sad.",
    isSpecial: true,
  },
  moviePosterTheme,
];

// -- STANDARD THEME CATEGORIES --

export const standardThemeCategories: ThemeCategory[] = [
  {
    title: "Art & Portraits",
    id: "art-portraits",
    description: "Elegant, art-gallery style portraits of your pet.",
    subcategories: [
      {
        title: "Classic Portraits",
        themes: [
          {
            title: "Artist's Sketchbook Page",
            prompt: "A photorealistic portrait of the dog's face, presented as if it's a study taken directly from an artist's personal sketchbook. The core portrait is highly detailed, but it's surrounded by subtle, unfinished 'construction lines' and perhaps a few light shading swatches in a corner. The background should look like a piece of textured sketch paper.",
            badge: 'Staff Pick',
          },
          {
            title: "Bold & Modern Line Art",
            prompt: "A modern and bold portrait of the dog's face. The style is defined by clean, confident, and expressive black lines of varying thickness to define the form and features. It should include simple, blocky areas of greyscale shading to give it depth, but the primary focus is the powerful line work. The overall feel is contemporary, graphic, and artistic on a clean background.",
          },
          {
            title: "Classic Graphite Portrait",
            prompt: "A timeless and highly detailed photorealistic portrait of the dog's face, created in the style of a master artist using fine-tipped graphite pencils. The focus is on capturing the intricate texture of the fur with delicate lines and soft, blended shading. The background should be a simple, clean, neutral tone to emphasize the subject.",
            badge: 'New',
          },
          {
            title: "Classical Etching Style",
            prompt: "A formal and distinguished photorealistic portrait of the dog's face, created to mimic the look of a classical, old-world etching. The shading and form are built using very fine, precise, parallel and cross-hatched lines (engraving style), giving the image a sophisticated and dignified quality, like an illustration from a historic book.",
          },
          {
            title: "Dramatic Charcoal Study",
            prompt: "An expressive and moody photorealistic portrait of the dog's face, in the style of a dramatic charcoal drawing. The image should have high contrast, with deep, rich blacks, soft edges, and visible smudging to create a powerful, artistic feel. The lighting should be dramatic, focusing on the light and shadow across the dog's features, with a minimal, dark background.",
          },
          {
            title: "Expressive Mixed Media",
            prompt: "A rich and textured photorealistic portrait of the dog's face, created in an expressive mixed media style. The base is a realistic pencil drawing, but with deep shadows added with smudged charcoal, and sharp, bright highlights picked out with a white ink pen. The background should have a subtle, light paper texture to enhance the mixed media feel.",
            badge: 'New',
          },
          {
            title: "Intricate Ink Stipple Portrait",
            prompt: "A meticulous and detailed photorealistic portrait of the dog's face, created entirely using the stippling technique. The image is built from thousands of tiny ink dots; the density of the dots creates the shading and form. This technique results in an incredible texture, giving the portrait an almost 'engraved' or printed quality, on a clean, simple background.",
          },
          {
            title: "Master's Cross-Hatch Sketch",
            prompt: "A sophisticated photorealistic portrait of the dog's face, created in the style of an old master's ink drawing, like Leonardo da Vinci's sketches. The shading, form, and depth should be built up using visible, intersecting lines (cross-hatching). The final image should look technical, elegant, and intentional, on a simple, parchment-like background.",
            badge: 'Popular',
          },
          {
            title: "Vintage Sepia Wash",
            prompt: "A nostalgic and warm photorealistic portrait of the dog's face, evoking the feeling of a vintage photograph or a classic illustration. The style should be a detailed pencil or ink drawing overlaid with a light, warm brown 'sepia' watercolor wash, giving it a beautiful, aged, and gentle appearance. The background should be simple and unobtrusive.",
          },
          {
            title: "White Charcoal on Black Canvas",
            prompt: "A striking and dramatic photorealistic portrait of the dog's face, created in the style of white charcoal or pastel on a solid black canvas. Instead of drawing shadows, the artist is drawing the light, making highlights on the fur, eyes, and nose pop. This creates a stunning, high-impact image where the dog emerges from the darkness.",
            badge: 'Trending',
          },
        ]
      },
      {
        title: "Zentangle & Abstract",
        themes: [
          {
            title: "Classic Floral Zentangle",
            prompt: "A detailed portrait of the dog's face, where the fur and shading are rendered in an intricate Zentangle style. The patterns should be organic and flowing, composed of classic floral elements like intricate leaves, swirling vines, delicate flower petals, and seed pods.",
            badge: 'New',
          },
          {
            title: "Cosmic Swirls Zentangle",
            prompt: "A mystical portrait of the dog's face, filled with celestial-themed Zentangle patterns. The dog's features should be formed by swirling galaxies, crescent moons, twinkling star patterns, and flowing, nebula-like lines, creating a dreamy and cosmic image.",
            badge: 'Popular',
          },
          {
            title: "Feathered Zentangle",
            prompt: "An ethereal portrait of the dog's face, where all the Zentangle patterns are based on the texture and flow of feathers. The fur should be rendered with patterns of soft, sweeping wing feathers and the intricate details of a peacock's eye, giving the dog a soft, bird-like quality.",
          },
          {
            title: "Geometric Mosaic Zentangle",
            prompt: "A modern portrait of the dog's face, created in a Zentangle style using sharp, structured, geometric patterns. The dog's form should be filled with a mosaic of repeating shapes like triangles, clean cross-hatching, grids, and circles, giving it a crystalline, abstract quality.",
          },
          {
            title: "High-Contrast Zentangle",
            prompt: "A dramatic, high-contrast portrait of the dog's face in a Zentangle style that plays with negative space. Some sections are filled with incredibly dense, intricate patterns, while other sections, like the deepest shadows, are filled with solid, bold black ink, creating a powerful visual impact.",
            badge: 'Trending',
          },
          {
            title: "Jeweled Mandala Zentangle",
            prompt: "An ornate and intricate portrait of the dog's face, created in a jeweled mandala Zentangle style. The patterns should be circular and radial, expanding outwards from central points like the eyes or nose in concentric rings of incredible detail, as if the dog is adorned with fine jewelry.",
            badge: 'New',
          },
          {
            title: "Minimalist Zen Lines",
            prompt: "A clean and calming portrait of the dog's face, created in a minimalist Zentangle style. Instead of filling every space, this style uses a few carefully chosen, elegant line patterns with plenty of clean white space between them, focusing on the beauty of the individual lines.",
            badge: 'Staff Pick',
          },
          {
            title: "Oceanic Waves Zentangle",
            prompt: "A serene portrait of the dog's face, rendered in an oceanic Zentangle style. The patterns should mimic the flow of water, with fur and shading composed of rolling waves, fish scales, bubbling circles, and coral-like textures.",
          },
          {
            title: "Stained Glass Zentangle",
            prompt: "A portrait of the dog's face in a style that mimics a leaded stained glass window. The main features are outlined with thick, bold black lines, creating distinct sections. Each section is then filled with its own unique, simpler Zentangle pattern.",
            badge: 'Popular',
          },
          {
            title: "Tribal Pattern Zentangle",
            prompt: "A powerful portrait of the dog's face, drawing inspiration from bold tribal and Aztec-style Zentangle patterns. The dog's form should be filled with strong, repeating motifs, sharp angles, and symmetrical designs to create a symbolic and impactful image.",
          },
        ]
      },
      {
        title: "Stained Glass Styles",
        themes: [
          {
            title: "Abstract Geometric Panel",
            prompt: "A modern and minimalist stained glass style. The dog's form is simplified and deconstructed into a beautiful mosaic of clean, geometric shapes—triangles, circles, and rectangles—with bold black lines separating the segments.",
          },
          {
            title: "Art Deco Sunburst",
            prompt: "A glamorous and geometric Art Deco stained glass style from the 1920s. The dog is stylized with sharp angles and sleek lines, framed by a bold, symmetrical sunburst or skyscraper-like geometric patterns with bold black lines.",
          },
          {
            title: "Art Nouveau Masterpiece",
            prompt: "An elegant, flowing design inspired by Art Nouveau stained glass. The dog's form is integrated with graceful, organic 'whiplash' curves, stylized flowers (like irises or lilies), and flowing natural elements with bold black lines.",
            badge: 'Staff Pick',
          },
          {
            title: "Gothic Cathedral Window",
            prompt: "A majestic and dramatic design in the style of a stained glass Gothic cathedral window. The dog is the central figure, framed by a pointed arch, intricate tracery, and ornate, symbolic patterns with bold black lines.",
          },
          {
            title: "Mystical Mandala Window",
            prompt: "A spiritual and intricate circular stained glass design. The dog's face is the serene center of a complex, radial mandala pattern, with repeating geometric and floral motifs expanding outwards, all rendered with bold black lines.",
          },
        ]
      }
    ]
  },
  {
    title: "Fantasy & Adventure",
    id: "fantasy-adventure",
    description: "Send your pet on epic quests and magical journeys.",
    subcategories: [
      {
        title: "Epic Adventures",
        themes: [
          {
            title: "Ancient Egypt Explorer",
            prompt: "An archaeological adventure in Ancient Egypt. The dog is an explorer, wearing a safari hat, discovering a hidden tomb. The background is filled with hieroglyphics, a majestic pyramid, and the Sphinx.",
          },
          {
            title: "Artist's Studio",
            prompt: "A creative and slightly messy artist's studio. The dog is the artist, wearing a beret and holding a paintbrush, standing in front of an easel with a half-finished masterpiece. The background is filled with paint splatters and art supplies.",
          },
          {
            title: "Busy Day Construction",
            prompt: "A fun and busy construction site. The dog is the foreman, wearing a hard hat and looking at blueprints, while other animal workers operate cranes, dump trucks, and bulldozers in the background.",
          },
          {
            title: "Dapper Dog Detective",
            prompt: "A classic, film-noir detective scene. The dog is a detective, complete with a trench coat and a fedora, examining a clue (a mysterious paw print) with a magnifying glass. The background is a foggy, cobblestone street at night.",
            badge: 'Popular',
          },
          {
            title: "Deep Sea Scuba Diver",
            prompt: "A fun underwater exploration scene. The dog is a scuba diver, wearing a diving helmet and gear, surrounded by friendly sea creatures like a smiling octopus, a curious turtle, and colorful schools of fish. The background is a coral reef with a sunken pirate ship.",
          },
          {
            title: "Dinosaur Safari",
            prompt: "A prehistoric adventure. The dog is an explorer in a lush jungle, curiously looking at a group of friendly, plant-eating dinosaurs like a giant Brontosaurus and a baby Triceratops.",
          },
          {
            title: "The Firehouse Dog",
            prompt: "A heroic scene at a fire station. The dog is a firehouse mascot, wearing a firefighter's helmet and sitting proudly on a shiny red fire truck, ready for action.",
          },
          {
            title: "Jungle Book Adventure",
            prompt: "A vibrant jungle scene. The dog is exploring a dense, lush jungle, surrounded by exotic animals like a friendly monkey swinging from a vine, a colorful parrot, and a sleepy snake.",
          },
          {
            title: "Pirate's Treasure Hunt",
            prompt: "A swashbuckling pirate adventure on a tropical island. The dog is a pirate captain, wearing an eye patch and a pirate hat, standing next to a treasure chest overflowing with gold coins and jewels. A pirate ship is anchored in the bay.",
            badge: 'Hot',
          },
          {
            title: "Rockstar's World Tour",
            prompt: "An electrifying concert scene. The dog is a rockstar on stage, playing a cool guitar in front of a massive crowd of adoring fans. The background is filled with stage lights, amplifiers, and a drum set.",
            badge: 'Trending',
          },
          {
            title: "Superhero's Grand Entrance",
            prompt: "A dynamic and heroic superhero scene. The dog is a superhero, wearing a cool cape and a mask with a custom emblem. They are striking a powerful pose in front of a city skyline, ready to save the day.",
            badge: "Dog's Favorite",
          },
          {
            title: "Wild West Sheriff",
            prompt: "A fun, Wild West scene. The dog is the town sheriff, wearing a cowboy hat and a sheriff's badge, standing proudly in front of an old-timey saloon in a classic western town.",
            badge: 'Staff Pick',
          },
        ]
      },
      {
        title: "Magical & Fairytale",
        themes: [
          {
            title: "Crystal Cave Explorer",
            prompt: "A magical adventure scene where the dog is an explorer. The dog has just discovered a hidden cave where the walls, floor, and ceiling are covered in huge, glowing, beautifully faceted crystals of all shapes and sizes, casting a magical light.",
          },
          {
            title: "Dragon's Best Friend",
            prompt: "A high-fantasy adventure where the dog is playing fetch with a friendly, cute, and definitely not-scary baby dragon. The background is a rocky, mountainous landscape with a castle in the distance.",
          },
          {
            title: "Enchanted Forest Friend",
            prompt: "A magical forest scene where the dog is befriending other cute, woodland creatures like a wise old owl, a friendly deer, and a family of mischievous squirrels. The trees have glowing patterns on their bark.",
          },
          {
            title: "Enchanted Library",
            prompt: "A magical and whimsical scene inside an enchanted library. The dog is looking up in awe, surrounded by towering, curved bookshelves that seem to stretch up into the clouds. A few magical books are floating gently in the air with glowing trails.",
          },
          {
            title: "Fairy Garden Tea Party",
            prompt: "A whimsical, magical tea party in an enchanted fairy garden. The dog is wearing delicate fairy wings and a flower crown, sitting at a tiny table with friendly fairies. The scene is filled with glowing mushrooms, sparkling flowers, and a miniature tea set.",
            badge: 'New',
          },
          {
            title: "Floating Lantern Sky",
            prompt: "A beautiful and awe-inspiring festival scene at night. The dog is sitting on a hilltop, looking up in wonder at a sky filled with hundreds of glowing paper lanterns that are floating peacefully upwards. The mood is magical and serene.",
            badge: "Dog's Favorite",
          },
          {
            title: "Magical Unicorn Rider",
            prompt: "A fantastical journey through a celestial landscape. The dog is joyfully riding on the back of a majestic, sparkling unicorn with a rainbow mane and tail. The background is a dreamy sky filled with fluffy clouds and twinkling stars.",
          },
          {
            title: "Mermaid's Lagoon",
            prompt: "A beautiful underwater adventure in a sparkling mermaid lagoon. The dog has a shimmering mermaid tail and is swimming gracefully among colorful coral reefs, friendly fish, and a hidden treasure chest overflowing with pearls and shells.",
            badge: 'Popular',
          },
          {
            title: "Princess Pup's Royal Ball",
            prompt: "A grand fairytale ball in a magnificent castle ballroom. The dog is dressed as a princess in a beautiful, sparkling ball gown and a tiara. The background features chandeliers, grand staircases, and other animal guests dancing.",
          },
          {
            title: "Royal Carriage Ride",
            prompt: "A fairytale moment. The dog is looking regal, peeking out of the window of an ornate, magical carriage (perhaps pumpkin-shaped) pulled by majestic creatures like unicorns or glowing horses, on its way to a royal ball.",
          },
          {
            title: "Secret Garden Key",
            prompt: "A scene of discovery and wonder. The dog has found an old, ornate key and is about to unlock a mysterious, vine-covered wooden door set into a stone wall, leading to a hidden, secret garden.",
          },
          {
            title: "Stargazer's Dream",
            prompt: "A peaceful and dreamy celestial scene. The dog is sleeping on a crescent moon, gently floating in a beautiful night sky. The background is filled with twinkling constellations, soft, glowing nebulas, and a few friendly shooting stars.",
            badge: 'Staff Pick',
          },
          {
            title: "Wizard's Apprentice",
            prompt: "The dog is a wizard's apprentice in a magical laboratory, wearing a pointy hat and a robe with stars on it. They are playfully trying to catch floating bubbles that have small, magical objects inside them, with spellbooks and potions in the background.",
          },
        ]
      },
    ]
  },
  {
    title: "Dogs Eating Food",
    id: "dogs-eating-food",
    description: "Hilarious and delicious scenes of your dog enjoying their favorite meals!",
    subcategories: [
      {
        title: "Savory Feasts",
        themes: [
          { title: "Mountain of Bacon", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized mountain of crispy bacon. The scene is messy and joyful.", category: 'food' },
          { title: "Tower of Pizza", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized tower of cheesy pizza slices. The scene is messy and joyful.", category: 'food' },
          { title: "Ocean of Tacos", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized ocean of tacos, maybe even raining from the sky. The scene is messy and joyful.", category: 'food' },
          { title: "Galaxy of Burgers", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized galaxy of burgers and fries. The scene is messy and joyful.", category: 'food' },
          { title: "Volcano of Spaghetti", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized volcano of spaghetti and meatballs. The scene is messy and joyful.", category: 'food' },
          { title: "Sushi Conveyor Belt", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized conveyor belt of sushi. The scene is messy and joyful.", category: 'food' },
          { title: "Bucket of Fried Chicken", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized bucket of fried chicken. The scene is messy and joyful.", category: 'food' },
          { title: "Pool of Nachos", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized swimming pool of nachos with cheese. The scene is messy and joyful.", category: 'food' },
          { title: "Train of Hot Dogs", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized train of hot dogs. The scene is messy and joyful.", category: 'food' },
          { title: "Perfect Steak Dinner", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized, perfectly cooked steak dinner. The scene is messy and joyful.", category: 'food' },
          { title: "River of Ramen", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized river of ramen noodles. The scene is messy and joyful.", category: 'food' },
          { title: "Rack of BBQ Ribs", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized rack of BBQ ribs. The scene is messy and joyful.", category: 'food' },
          { title: "Wall of Chinese Takeout", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized great wall of Chinese takeout boxes. The scene is messy and joyful.", category: 'food' },
          { title: "Avalanche of Popcorn", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized avalanche of popcorn. The scene is messy and joyful.", category: 'food' },
          { title: "Luxurious Lobster Dinner", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized, luxurious lobster dinner. The scene is messy and joyful.", category: 'food' },
          { title: "Pile of Pup-Peroni", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized pile of Pup-Peroni treats. The scene is messy and joyful.", category: 'food' },
          {
            title: "Create Your Own Feast...",
            prompt: CUSTOM_FOOD_VALUE,
            category: 'food',
            isSpecial: true
          }
        ]
      },
      {
        title: "Sweet Treats",
        themes: [
          { title: "Endless Ice Cream", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized, endless ice cream sundae. The scene is messy and joyful.", category: 'food' },
          { title: "Skyscraper of Pancakes", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized skyscraper of pancakes with syrup. The scene is messy and joyful.", category: 'food' },
          { title: "Universe of Donuts", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized universe of donuts. The scene is messy and joyful.", category: 'food' },
          { title: "Giant Birthday Cake", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized giant birthday cake. The scene is messy and joyful.", category: 'food' },
          { title: "Fortress of Waffles", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized fortress of waffles. The scene is messy and joyful.", category: 'food' },
          { title: "Cloud of Pup Cups", prompt: "A fun and hilarious food-themed scene where the dog is ecstatically devouring a ridiculously large, comically oversized cloud of pup cups (whipped cream). The scene is messy and joyful.", category: 'food' }
        ]
      }
    ]
  },
  {
    title: "Cozy & Cute",
    id: "cozy-cute",
    description: "Sweet, charming, and adorable themes for your pup.",
    subcategories: [
      {
        title: "Charming Gardens",
        themes: [
          {
            title: "Butterfly Sanctuary",
            prompt: "A garden designed as a haven for butterflies. The dog is sitting gently among flowers known to attract them, like milkweed and zinnias, while dozens of detailed butterflies fill the air.",
          },
          {
            title: "Desert Bloom Garden",
            prompt: "A unique and striking desert landscape. The dog is exploring a garden of resilient desert plants, with vibrant, colorful flowers blooming on cacti and intricate succulents.",
          },
          {
            title: "English Cottage Garden",
            prompt: "A cozy, overflowing English cottage garden. The dog is peeking over a charming, weathered stone wall, surrounded by classic flowers like roses, lavender, and foxgloves.",
            badge: 'Popular',
          },
          {
            title: "French Palace Garden",
            prompt: "A grand, formal garden inspired by Versailles. The dog is posed majestically amidst perfectly manicured topiaries, symmetrical flowerbeds, and an ornate stone fountain.",
          },
          {
            title: "Japanese Zen Garden",
            prompt: "A serene and minimalist Japanese Zen garden. The dog is relaxing near cherry blossom trees, a tranquil koi pond with a small wooden bridge, and carefully placed stones and lanterns.",
          },
          {
            title: "Magical Moonlit Garden",
            prompt: "An ethereal, nighttime garden. Flowers and mushrooms give off a soft, magical glow, and the dog is surrounded by twinkling fireflies and gentle moonbeams filtering through the trees.",
            badge: 'Staff Pick',
          },
          {
            title: "Secret Overgrown Garden",
            prompt: "A mysterious and romantic overgrown garden. The dog has discovered a forgotten space with ancient, moss-covered statues, tangled ivy, and a hidden, vine-covered door.",
          },
          {
            title: "Tropical Rainforest Garden",
            prompt: "A lush, exotic tropical rainforest garden. The dog is surrounded by giant ferns, vibrant orchids, oversized leaves, and perhaps a friendly toucan or a waterfall in the background.",
          },
          {
            title: "Whimsical Vegetable Patch",
            prompt: "A playful and charming vegetable patch. The dog is curiously sniffing giant, friendly sunflowers and rows of cartoonish vegetables, like plump pumpkins and happy-looking carrots.",
          },
          {
            title: "Wildflower Meadow",
            prompt: "A beautiful, untamed field of wildflowers. The dog is joyfully bounding through a sea of poppies, daisies, and cornflowers, with butterflies fluttering all around.",
          },
        ]
      },
      {
        title: "Cozy at Home",
        themes: [
          {
            title: "Cozy Reading Nook",
            prompt: "A cozy reading nook scene. The dog is curled up asleep in a big, comfy armchair next to a tall window. On a small table beside the chair, there's a stack of books and a steaming mug. The overall feeling is warm, safe, and peaceful.",
            badge: 'Popular',
          },
          {
            title: "Knitting Companion",
            prompt: "A warm and cozy scene where the dog is a knitting companion. The dog is sleeping peacefully in a soft, woven basket that is filled with colorful balls of yarn. A half-finished scarf and a pair of knitting needles are resting beside the basket.",
          },
          {
            title: "Rainy Day Window",
            prompt: "A peaceful rainy day scene from inside a cozy room. The dog is sitting on a windowsill, looking out at the rain streaming down the glass. Outside, you can see a blurry, charming street scene. The mood is calm and contemplative.",
          },
          {
            title: "Sunbeam Nap",
            prompt: "A simple, beautiful scene of a dog taking a nap. The dog is stretched out on a fluffy rug or a warm wooden floor, basking in a bright, dramatic sunbeam that is pouring in from a window, creating a feeling of warmth and contentment.",
            badge: "Dog's Favorite",
          },
        ]
      },
      {
        title: "Sweet & Chic",
        themes: [
          {
            title: "Artisan Flower Market",
            prompt: "A vibrant and beautiful scene at an open-air European flower market. The dog is sitting happily amongst numerous buckets and vases filled with an abundance of fresh, beautiful flowers like tulips, peonies, roses, and sunflowers. The scene is bustling and colorful.",
          },
          {
            title: "Boutique Shopping Spree",
            prompt: "A fun and glamorous shopping scene. The dog is peeking its head out of a stylish designer shopping bag. The bag is sitting on the floor, surrounded by several other beautifully wrapped gift boxes and shopping bags from luxury boutiques.",
          },
          {
            title: "Butterfly Garden",
            prompt: "A serene and enchanting garden scene. The dog is sitting gently in a lush flower garden, completely surrounded by dozens of large, beautiful, and intricately detailed butterflies. Some of the butterflies are fluttering in the air, and one is gently landing on the dog's nose.",
          },
          {
            title: "Candy Land Adventure",
            prompt: "A delicious and vibrant world made entirely of sweets. The dog is joyfully exploring a landscape with lollipop trees, gingerbread houses, a river of chocolate, and hills made of ice cream scoops.",
            badge: 'Trending',
          },
          {
            title: "Cosmic Snack Quest",
            prompt: "An out-of-this-world space adventure. The dog is an astronaut floating in a galaxy where the planets are shaped like hamburgers, pizzas, and giant donuts. Comets are made of French fries, and a friendly alien is offering a space-taco.",
          },
          {
            title: "The Great Dog Bake-Off",
            prompt: "A fun and slightly chaotic baking scene in a cozy kitchen. The dog is the chef, wearing a baker's hat and an apron, playfully covered in a little bit of flour while surrounded by dog-friendly cookies, cupcakes, and baking ingredients.",
          },
          {
            title: "Parisian Café",
            prompt: "A chic and charming scene at a Parisian sidewalk café. The dog is sitting elegantly at a small, round bistro table. On the table is a tiny cup (a puppuccino) and a croissant. In the background, the Eiffel Tower is visible down a quaint cobblestone street.",
            badge: 'Staff Pick',
          },
          {
            title: "Spa Day Pampering",
            prompt: "A funny and relaxing spa day scene. The dog is lying on a fluffy white towel, completely relaxed, with two cucumber slices over its eyes and a smaller towel wrapped neatly around its head like a turban. A few candles and flower petals are arranged nearby.",
          },
          {
            title: "The Ultimate Picnic",
            prompt: "A perfect picnic scene in a sunny park. The dog is sitting on a classic checkered blanket, surrounded by an extravagant spread of food, including a giant sandwich, a watermelon, and a basket overflowing with treats. A few friendly ants are marching by.",
            badge: 'Popular',
          },
        ]
      },
    ]
  },
  {
    title: "Dogs with Jobs",
    id: "dogs-with-jobs",
    description: "See your pup take on a new career!",
    subcategories: [
      {
        title: "Professional Pups",
        themes: [
          {
            title: "Artist",
            prompt: "A thoughtful dog as an artist, in a messy studio, wearing a beret and holding a paintbrush to a canvas.",
            category: 'jobs',
          },
          {
            title: "Astronaut",
            prompt: "An adventurous dog as an astronaut, in a full space suit, floating among the stars with the Earth visible through the spaceship window.",
            category: 'jobs',
            badge: 'Hot',
          },
          {
            title: "Barista",
            prompt: "A friendly dog as a barista, wearing an apron, skillfully making latte art behind a big espresso machine in a cool coffee shop.",
            category: 'jobs',
          },
          {
            title: "Bottle Service",
            prompt: "A glamorous dog working bottle service in a VIP section of a nightclub. The dog is presenting a bottle of champagne and holding a big, flashy, light-up sign. The sign should be a centerpiece of the image.",
            category: 'jobs',
          },
          {
            title: "Chef",
            prompt: "A dog as a top chef, wearing a tall chef's hat and tasting a delicious stew from a big pot in a bustling professional kitchen.",
            category: 'jobs',
          },
          {
            title: "Construction Worker",
            prompt: "A tough-looking dog as a construction worker, in a hard hat, confidently operating a big yellow bulldozer on a construction site.",
            category: 'jobs',
          },
          {
            title: "Dentist",
            prompt: "A friendly dog as a dentist, in a white coat, holding a dental mirror and bravely looking at a cartoon crocodile's giant teeth. The scene is a bright, clean dental office.",
            category: 'jobs',
          },
          {
            title: "DJ",
            prompt: "A cool dog as a DJ, wearing headphones, behind a set of turntables at a packed nightclub, with laser lights in the background.",
            category: 'jobs',
          },
          {
            title: "Doctor",
            prompt: "A caring dog as a doctor, with a stethoscope and a lab coat, wisely looking at an X-ray of a squeaky toy in a friendly doctor's office.",
            category: 'jobs',
            badge: 'Popular',
          },
          {
            title: "Farmer",
            prompt: "A happy dog as a farmer, in overalls, driving a tractor through a field with a barn and other farm animals in the background.",
            category: 'jobs',
          },
          {
            title: "Firefighter",
            prompt: "A heroic dog as a firefighter, in a classic firefighter's helmet, proudly standing in front of a shiny red fire truck.",
            category: 'jobs',
          },
          {
            title: "Hair Stylist",
            prompt: "A chic dog as a hair stylist, with scissors and a comb, giving a fabulous new hairdo to a fluffy poodle in a trendy salon setting.",
            category: 'jobs',
          },
          {
            title: "Lawyer",
            prompt: "A sharp-looking dog as a lawyer, in a suit, dramatically pointing a paw in a courtroom. A jury of other animals looks on.",
            category: 'jobs',
          },
          {
            title: "Librarian",
            prompt: "A quiet dog as a librarian, with glasses, peeking over a stack of books at a cozy library desk, with shelves of books all around.",
            category: 'jobs',
            badge: 'Staff Pick',
          },
          {
            title: "Mechanic",
            prompt: "A handy dog as a mechanic, sliding out from under a classic car on a creeper, holding a wrench with a smudge of grease on their nose.",
            category: 'jobs',
          },
          {
            title: "News Anchor",
            prompt: "A professional dog as a news anchor, in a suit and tie, sitting at a news desk and reporting the 'Daily Bark' with a city skyline graphic behind them.",
            category: 'jobs',
          },
          {
            title: "Pilot",
            prompt: "A skilled dog as a pilot, in a classic pilot's uniform with a hat and scarf, sitting in the cockpit of a vintage airplane.",
            category: 'jobs',
          },
          {
            title: "Police Officer",
            prompt: "A brave dog as a police officer, in a police hat, enjoying a well-deserved donut break while sitting in a patrol car.",
            category: 'jobs',
          },
          {
            title: "Professor",
            prompt: "An intellectual dog as a professor, with a tweed jacket and glasses, standing at a lectern in a university lecture hall, pointing to a complex diagram on a large screen.",
            category: 'jobs',
          },
          {
            title: "Realtor",
            prompt: "A smiling dog as a realtor, in a blazer, holding up a set of keys in front of a beautiful house with a big 'SOLD' sign in the yard.",
            category: 'jobs',
          },
          {
            title: "Rockstar",
            prompt: "A superstar dog as a rockstar, with a cool guitar, on a huge stage with bright lights and a cheering crowd of fans.",
            category: 'jobs',
            badge: "Dog's Favorite",
          },
          {
            title: "Scientist",
            prompt: "A brilliant dog as a scientist, in a lab coat, surrounded by bubbling beakers and colorful potions in a science lab.",
            category: 'jobs',
          },
          {
            title: "Software Developer",
            prompt: "A focused dog as a software developer, with headphones on, typing away on a laptop with lines of code (and maybe some bone emojis) on the screen.",
            category: 'jobs',
          },
          {
            title: "Student",
            prompt: "A diligent dog as a student, sitting at a desk in a classroom, with a backpack, pencil, and notebook, looking attentively at the teacher's chalkboard.",
            category: 'jobs',
          },
          {
            title: "Teacher",
            prompt: "A wise dog as a teacher, with glasses, teaching a class of attentive puppies in front of a chalkboard full of fun doodles.",
            category: 'jobs',
          },
        ],
      }
    ]
  },
  {
    title: "Sports Dogs",
    id: "sports-dogs",
    description: "See your pup as a professional athlete!",
    subcategories: [
      {
        title: "All Sports",
        themes: [
          {
            title: "Create a Custom Trading Card",
            prompt: SPORTS_CARD_VALUE,
            isSpecial: true,
            category: 'sportscard',
            badge: 'Interactive',
          },
          {
            title: "Baseball Star",
            prompt: "The dog is a baseball player, in a full uniform, swinging a bat at a baseball with intense focus. The background is a classic baseball stadium with cheering fans.",
            category: 'sports',
          },
          {
            title: "Basketball Pro",
            prompt: "The dog is a basketball pro, wearing a jersey and shorts, dunking a basketball with dramatic flair. The background is a packed basketball arena with a scoreboard.",
            category: 'sports',
            badge: 'Popular',
          },
          {
            title: "Football Legend",
            prompt: "The dog is a football legend, wearing a helmet and pads, running with the football for a touchdown. The background is a massive football stadium on game day.",
            category: 'sports',
          },
          {
            title: "Golf Pro",
            prompt: "The dog is a professional golfer, wearing a visor and a polo shirt, making a perfect putt on a beautiful, manicured green. The background is a sunny golf course.",
            category: 'sports',
          },
          {
            title: "Hockey Hero",
            prompt: "The dog is a hockey hero, in full hockey gear with a stick, skating at high speed across the ice. The background is a cheering crowd in a hockey rink.",
            category: 'sports',
          },
          {
            title: "Off-Road Racer",
            prompt: "The dog is an off-road racing champion, wearing a helmet and goggles, driving a suped-up side-by-side UTV at high speed through a muddy and rugged desert course. Dirt is flying everywhere.",
            category: 'sports',
          },
          {
            title: "Olympic Gymnast",
            prompt: "The dog is an olympic gymnast, wearing a leotard, performing a perfect routine on the balance beam or rings. The background is an olympic arena with flags.",
            category: 'sports',
          },
          {
            title: "Racing Champion",
            prompt: "The dog is a race car driver, wearing a helmet and racing suit, standing proudly next to a sleek, fast race car. The background is a race track with a checkered flag.",
            category: 'sports',
          },
          {
            title: "Skateboarding Pup",
            prompt: "The dog is a cool skateboarder, wearing a backward cap, skillfully grinding a rail at a gritty, graffiti-covered skatepark.",
            category: 'sports',
            badge: 'Trending',
          },
          {
            title: "Soccer Champion",
            prompt: "The dog is a soccer champion, wearing a team kit, kicking a soccer ball into the goal. The background is a huge soccer stadium filled with fans.",
            category: 'sports',
          },
          {
            title: "Surfing Dog",
            prompt: "The dog is a pro surfer, expertly riding a giant, perfect wave on a surfboard. The background is a sunny, tropical beach.",
            category: 'sports',
          },
          {
            title: "Tennis Ace",
            prompt: "The dog is a tennis ace, wearing a sweatband, serving a tennis ball with power and precision on a famous court like Wimbledon.",
            category: 'sports',
          },
          {
            title: "Volleyball Star",
            prompt: "The dog is a beach volleyball star, wearing sunglasses, spiking the ball over the net on a sandy beach court.",
            category: 'sports',
          },
        ]
      }
    ]
  },
];


const standardThemes: Theme[] = standardThemeCategories.flatMap(category =>
    category.subcategories.flatMap(subcategory => subcategory.themes)
);


export const themes: Theme[] = [
  ...standardThemes,
  ...cannabisThemes,
  ...logoThemes,
  ...specialOccasionThemes,
  ...activityThemes,
  // Virtual themes for internal logic, not displayed in UI
  { prompt: MOVIE_POSTER_FLYER_VALUE, title: "Movie Poster Flyer", category: 'movieposter', isSpecial: true },
  { prompt: MOVIE_POSTER_PREMIERE_VALUE, title: "Movie Poster Premiere", category: 'movieposter', isSpecial: true },
];
