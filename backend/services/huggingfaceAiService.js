const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

class HuggingFaceAIService {
  constructor() {
    this.apiToken = process.env.HUGGINGFACE_API_TOKEN;
    this.baseURL = "https://api-inference.huggingface.co/models"; // For ViT
    this.modelsLoaded = true;

    // Initialize axios clients
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
      timeout: 30000,
    });

    this.featherlessClient = axios.create({
      baseURL: this.featherlessURL,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  async loadModels() {
    if (!this.apiToken || this.apiToken === "your_huggingface_token_here") {
      console.log(
        "⚠️  Hugging Face API token not configured, using fallback mode"
      );
      this.modelsLoaded = false;
      return;
    }

    console.log("✅ ViT model ready for image analysis");
    this.modelsLoaded = true;
  }

  async processImage(imagePath) {
    try {
      if (
        !this.modelsLoaded ||
        !this.apiToken ||
        this.apiToken === "your_huggingface_token_here"
      ) {
        console.log("⚠️ Using fallback - no image analysis");
        return "No image analysis available";
      }

      // Optimize image for ViT
      const optimizedImagePath = await this.optimizeImageForViT(imagePath);

      // Convert image to buffer for API
      const imageBuffer = fs.readFileSync(optimizedImagePath);

      // Use Google ViT model for image classification
      const response = await this.client.post(
        "/google/vit-base-patch16-224",
        imageBuffer,
        {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        }
      );

      // Clean up optimized image
      setTimeout(() => {
        try {
          if (
            optimizedImagePath !== imagePath &&
            fs.existsSync(optimizedImagePath)
          ) {
            fs.unlinkSync(optimizedImagePath);
          }
        } catch (cleanupError) {
          console.log("Note: Could not clean up optimized image file");
        }
      }, 1000);

      // Extract and return ViT analysis
      if (response.data && Array.isArray(response.data)) {
        const vitLabels = response.data.slice(0, 10); // Get top 10 predictions
        console.log("🔍 ViT Analysis Results:", vitLabels);
        return vitLabels;
      }

      return null;
    } catch (error) {
      console.error(
        "ViT Image Analysis Error:",
        error.response?.status,
        error.response?.data
      );

      // Clean up on error
      setTimeout(() => {
        try {
          const optimizedImagePath = path.join(
            path.dirname(imagePath),
            `optimized_vit_${path.basename(imagePath)}`
          );
          if (fs.existsSync(optimizedImagePath)) {
            fs.unlinkSync(optimizedImagePath);
          }
        } catch (cleanupError) {
          console.log("Note: Could not clean up optimized image file");
        }
      }, 1000);

      return null;
    }
  }

  async optimizeImageForViT(imagePath) {
    try {
      const outputPath = path.join(
        path.dirname(imagePath),
        `optimized_vit_${path.basename(imagePath)}`
      );

      // ViT expects 224x224 images
      await sharp(imagePath)
        .resize(224, 224, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      console.error("Image optimization error:", error);
      return imagePath;
    }
  }

  async generateMovieRecommendations(imageDescription, userPrompt, mood) {
    console.log("🎬 Generating 10 movies using ViT analysis...");

    let movieTitles = [];

    // If we have ViT analysis, use it to generate movies
    if (imageDescription && Array.isArray(imageDescription)) {
      movieTitles = this.mapViTToMovies(imageDescription);
      console.log("🤖 ViT-based movie recommendations:", movieTitles);
    }

    // If no image analysis or not enough movies, use intelligent fallback
    if (movieTitles.length < 10) {
      console.log("🔄 Adding intelligent recommendations to reach 10 movies");
      const fallbackMovies = this.generateIntelligentFallback(userPrompt, mood);

      // Add unique movies to reach 10
      fallbackMovies.forEach((movie) => {
        if (!movieTitles.includes(movie) && movieTitles.length < 10) {
          movieTitles.push(movie);
        }
      });
    }

    console.log("🎭 Final 10 movie recommendations:", movieTitles);
    return movieTitles.slice(0, 10);
  }

  mapViTToMovies(vitLabels) {
    console.log("🔍 Mapping ViT labels to movies:", vitLabels);

    const movieRecommendations = [];

    // Comprehensive mapping from ViT labels to movies
    const vitToMovieMap = {
      // People
      person: [
        "Her",
        "Lost in Translation",
        "The Social Network",
        "Manchester by the Sea",
      ],
      man: ["Drive", "Blade Runner 2049", "The Machinist", "Nightcrawler"],
      woman: ["Black Swan", "Gone Girl", "The Handmaiden", "Lady Bird"],
      child: ["Moonrise Kingdom", "The Sixth Sense", "E.T.", "Super 8"],
      baby: [
        "Three Men and a Baby",
        "Baby Driver",
        "Rosemary's Baby",
        "The Boss Baby",
      ],
      boy: ["Boyhood", "The Karate Kid", "Stand by Me", "The Goonies"],
      girl: [
        "Lady Bird",
        "Thirteen",
        "The Virgin Suicides",
        "Girl, Interrupted",
      ],

      // Animals
      dog: ["John Wick", "Marley & Me", "The Artist", "Isle of Dogs"],
      cat: ["A Street Cat Named Bob", "The Cat Returns", "Cats", "Garfield"],
      horse: ["Seabiscuit", "War Horse", "The Black Stallion", "Spirit"],
      bird: ["Birdman", "The Birds", "Rio", "Fly Away Home"],
      fish: ["Finding Nemo", "The Shape of Water", "Life of Pi", "Big Fish"],

      // Vehicles
      car: ["Drive", "Baby Driver", "Gone in 60 Seconds", "Rush"],
      truck: ["Duel", "Over the Top", "Big Rig", "Breakdown"],
      bus: ["Speed", "The Bus", "Almost Famous", "Shang-Chi"],
      bicycle: ["Premium Rush", "E.T.", "The Bicycle Thief", "Quicksilver"],
      motorcycle: [
        "Easy Rider",
        "The Motorcycle Diaries",
        "Torque",
        "Ghost Rider",
      ],
      train: ["Snowpiercer", "The Commuter", "Unstoppable", "Source Code"],
      airplane: ["Flightplan", "Non-Stop", "Sully", "Top Gun"],
      boat: ["Life of Pi", "Cast Away", "Titanic", "The Perfect Storm"],

      // Indoor Objects
      chair: ["The Chair", "Green Room", "Misery", "Saw"],
      table: ["The Dinner", "Dinner for Schmucks", "The Last Supper", "Burnt"],
      bed: [
        "Bedtime Stories",
        "The Bed Sitting Room",
        "Bed of Roses",
        "Death Bed",
      ],
      book: [
        "The Book Thief",
        "The Reader",
        "Dead Poets Society",
        "Fahrenheit 451",
      ],
      computer: ["The Social Network", "Her", "Ex Machina", "Hackers"],
      television: ["The Truman Show", "Network", "Being There", "Videodrome"],
      phone: ["Cellular", "The Call", "Locke", "Phone Booth"],
      camera: [
        "Rear Window",
        "Blow-Up",
        "The Secret Life of Walter Mitty",
        "Paparazzi",
      ],
      clock: ["Groundhog Day", "About Time", "In Time", "The Time Machine"],
      mirror: ["Black Swan", "The Machinist", "Mirrors", "Shutter Island"],

      // Food and Drinks
      apple: [
        "Good Will Hunting",
        "The Teacher",
        "Snow White",
        "Dead Poets Society",
      ],
      banana: ["Bananas", "The Jungle Book", "Minions", "Donkey Kong"],
      orange: [
        "A Clockwork Orange",
        "The Godfather",
        "Citrus",
        "Call Me by Your Name",
      ],
      pizza: [
        "Do the Right Thing",
        "Teenage Mutant Ninja Turtles",
        "Mystic Pizza",
        "Chef",
      ],
      coffee: [
        "Coffee and Cigarettes",
        "You've Got Mail",
        "Pulp Fiction",
        "Her",
      ],
      wine: ["Sideways", "The Wine Country", "Bottle Shock", "Mondovino"],
      beer: ["Beerfest", "Strange Brew", "The World's End", "Drinking Buddies"],

      // Buildings and Architecture
      house: ["Parasite", "Hereditary", "The Conjuring", "Get Out"],
      building: ["Inception", "The Matrix", "Blade Runner", "Skyscraper"],
      church: [
        "The Hunchback of Notre Dame",
        "Stigmata",
        "The Magdalene Sisters",
        "Doubt",
      ],
      school: [
        "Dead Poets Society",
        "The Breakfast Club",
        "Ferris Bueller's Day Off",
        "Superbad",
      ],
      hospital: [
        "One Flew Over the Cuckoo's Nest",
        "The Hospital",
        "Awakenings",
        "Patch Adams",
      ],
      restaurant: [
        "Chef",
        "Julie & Julia",
        "The Hundred-Foot Journey",
        "Burnt",
      ],
      store: [
        "Clerk",
        "Empire Records",
        "You've Got Mail",
        "The Shop Around the Corner",
      ],
      office: ["Office Space", "The Apartment", "Her", "The Social Network"],

      // Nature and Outdoor
      tree: [
        "The Tree of Life",
        "A Monster Calls",
        "The Happening",
        "Into the Wild",
      ],
      flower: [
        "Little Women",
        "The Secret Garden",
        "Flowers for Algernon",
        "American Beauty",
      ],
      grass: [
        "The Grass Is Greener",
        "Grass",
        "Field of Dreams",
        "The Thin Red Line",
      ],
      mountain: ["The Mountain", "Everest", "Cliffhanger", "The Climb"],
      ocean: ["The Perfect Storm", "Cast Away", "Life of Pi", "Titanic"],
      sky: ["Sky High", "The Sky Is Falling", "Skyfall", "Sky Captain"],
      cloud: [
        "Clouds of Sils Maria",
        "The Clouds",
        "Cloud Atlas",
        "Partly Cloudy",
      ],
      sun: [
        "Little Miss Sunshine",
        "Sunshine",
        "The Sun Also Rises",
        "Midnight Sun",
      ],
      moon: ["Moon", "Moonrise Kingdom", "Moonlight", "A Trip to the Moon"],
      star: [
        "A Star Is Born",
        "The Fault in Our Stars",
        "Stardust",
        "Interstellar",
      ],

      // Colors (if ViT detects dominant colors)
      red: ["The Sixth Sense", "American Beauty", "Red", "The Matrix"],
      blue: [
        "Blue Is the Warmest Color",
        "The Blue Lagoon",
        "Blue Velvet",
        "Avatar",
      ],
      green: ["The Green Mile", "Green Book", "The Green Lantern", "The Hulk"],
      yellow: ["Kill Bill", "The Yellow Submarine", "Taxi Driver", "Sin City"],
      black: ["Black Swan", "The Dark Knight", "Black Panther", "Men in Black"],
      white: ["White Chicks", "Snow White", "The White Ribbon", "Whiplash"],

      // Abstract concepts that ViT might detect
      light: [
        "The Light Between Oceans",
        "Flashlight",
        "Light Sleeper",
        "City of Light",
      ],
      dark: ["The Dark Knight", "Dark City", "Darkness Falls", "The Darkness"],
      shadow: [
        "What We Do in the Shadows",
        "The Shadow",
        "Shadow of a Doubt",
        "In the Shadow",
      ],
      reflection: ["Black Swan", "The Machinist", "Shutter Island", "Identity"],

      // Clothing and Accessories
      hat: ["The Cat in the Hat", "Mad Hatter", "The Hat", "Indiana Jones"],
      glasses: ["The Matrix", "Men in Black", "Kingsman", "They Live"],
      watch: ["In Time", "About Time", "Pulp Fiction", "The Time Machine"],
      bag: [
        "The Bag Man",
        "Bag of Bones",
        "The Hangover",
        "Paper Bag Princess",
      ],
      shoe: [
        "The Shoemaker",
        "Kinky Boots",
        "Shoe Dog",
        "There's Something About Mary",
      ],

      // Weather
      rain: [
        "Singin' in the Rain",
        "The Matrix",
        "Blade Runner",
        "The Rain Man",
      ],
      snow: ["Fargo", "The Shining", "Frozen", "The Revenant"],
      storm: [
        "The Perfect Storm",
        "Storm Chasers",
        "The Tempest",
        "Take Shelter",
      ],
      wind: [
        "Gone with the Wind",
        "The Wind Rises",
        "Windtalkers",
        "The Wind That Shakes",
      ],

      // Actions/Poses that ViT might detect
      sitting: ["Lost in Translation", "Her", "The Conversation", "Locke"],
      standing: [
        "The Revenant",
        "Birdman",
        "There Will Be Blood",
        "Stand by Me",
      ],
      walking: [
        "Forrest Gump",
        "The Walk",
        "Walk the Line",
        "The Walking Dead",
      ],
      running: [
        "Run Lola Run",
        "Forrest Gump",
        "The Running Man",
        "Logan's Run",
      ],
      dancing: ["Black Swan", "La La Land", "Dirty Dancing", "Step Up"],
      sleeping: [
        "Inception",
        "The Matrix",
        "Awakenings",
        "While You Were Sleeping",
      ],
      eating: ["Julie & Julia", "Chef", "Eat Pray Love", "The Cook"],
      drinking: [
        "Sideways",
        "The World's End",
        "Leaving Las Vegas",
        "Cocktail",
      ],
      working: [
        "Office Space",
        "The Apartment",
        "Working Girl",
        "Nine to Five",
      ],
      playing: [
        "The Player",
        "Ready Player One",
        "Child's Play",
        "Playing by Heart",
      ],
      reading: [
        "The Reader",
        "The Book Thief",
        "Dead Poets Society",
        "Finding Forrester",
      ],
      writing: ["The Shining", "Adaptation", "Finding Forrester", "The Writer"],
      cooking: ["Chef", "Julie & Julia", "Burnt", "The Hundred-Foot Journey"],
      driving: ["Drive", "Baby Driver", "Rush", "Ford v Ferrari"],
      flying: ["Top Gun", "Fly Away Home", "The Aviator", "Flyboys"],
      swimming: [
        "The Shape of Water",
        "Life of Pi",
        "The Swimmer",
        "Finding Nemo",
      ],
      climbing: ["Free Solo", "Everest", "Cliffhanger", "The Climb"],
      fighting: ["Fight Club", "Rocky", "The Fighter", "Warrior"],
      kissing: ["The Notebook", "Titanic", "Ghost", "Casablanca"],
      hugging: ["Her", "The Pursuit of Happyness", "About Time", "Big Fish"],
      crying: [
        "Manchester by the Sea",
        "Inside Out",
        "The Pursuit of Happyness",
        "Crying Game",
      ],
      laughing: ["The Joker", "Laughing Gas", "The Last Laugh", "Patch Adams"],
      smiling: [
        "The Pursuit of Happyness",
        "Smile",
        "Life Is Beautiful",
        "The Intouchables",
      ],
      looking: ["Rear Window", "The Watchers", "Eyes Wide Shut", "The Lookers"],
      pointing: ["E.T.", "The Pointing Man", "Point Break", "The Point"],
      holding: ["The Firm Grip", "Holding On", "The Holder", "Hold the Dark"],
      touching: [
        "The Touch",
        "Touching the Void",
        "A Touch of Evil",
        "The Touching",
      ],
      listening: [
        "The Listeners",
        "Sound of Metal",
        "A Quiet Place",
        "The Listener",
      ],
      talking: [
        "The Talkers",
        "Talk to Her",
        "Talking Heads",
        "The King's Speech",
      ],
      singing: [
        "A Star Is Born",
        "La La Land",
        "The Greatest Showman",
        "Mamma Mia!",
      ],
      music: [
        "Whiplash",
        "Almost Famous",
        "School of Rock",
        "The Sound of Music",
      ],
      instrument: ["Whiplash", "The Piano", "August Rush", "Once"],
      guitar: [
        "School of Rock",
        "Walk the Line",
        "Almost Famous",
        "This Is Spinal Tap",
      ],
      piano: ["The Piano", "Whiplash", "The Pianist", "Green Book"],
      violin: [
        "The Red Violin",
        "The Soloist",
        "Music of the Heart",
        "Copying Beethoven",
      ],
      drum: ["Whiplash", "The Drummer", "Sound of Metal", "Drumline"],

      // Sports and Games
      ball: ["The Ball", "Hardball", "The Longest Yard", "Any Given Sunday"],
      football: [
        "The Blind Side",
        "Friday Night Lights",
        "Any Given Sunday",
        "The Longest Yard",
      ],
      basketball: [
        "Space Jam",
        "Coach Carter",
        "Hoosiers",
        "White Men Can't Jump",
      ],
      baseball: [
        "Field of Dreams",
        "The Sandlot",
        "Moneyball",
        "A League of Their Own",
      ],
      tennis: [
        "Wimbledon",
        "Battle of the Sexes",
        "Borg vs McEnroe",
        "The Royal Tenenbaums",
      ],
      golf: [
        "Happy Gilmore",
        "Caddyshack",
        "The Legend of Bagger Vance",
        "Tin Cup",
      ],
      boxing: ["Rocky", "Raging Bull", "The Fighter", "Creed"],
      swimming: [
        "The Shape of Water",
        "Life of Pi",
        "The Swimmer",
        "Finding Nemo",
      ],
      running: [
        "Forrest Gump",
        "Chariots of Fire",
        "The Running Man",
        "Run Lola Run",
      ],
      cycling: [
        "Premium Rush",
        "The Bicycle Thief",
        "Breaking Away",
        "Quicksilver",
      ],
      skating: [
        "I, Tonya",
        "Blades of Glory",
        "The Cutting Edge",
        "Ice Princess",
      ],
      skiing: [
        "Downhill",
        "Better Off Dead",
        "Ski School",
        "The Downhill Racer",
      ],
      surfing: [
        "Point Break",
        "Blue Crush",
        "The Endless Summer",
        "Soul Surfer",
      ],
      dancing: ["Black Swan", "Dirty Dancing", "Step Up", "La La Land"],
      yoga: [
        "Eat Pray Love",
        "The Guru",
        "Yoga Hosers",
        "Bend It Like Beckham",
      ],
      exercise: ["Pumping Iron", "The Fitness", "Perfect", "Gym Teacher"],
      game: ["Ready Player One", "The Game", "Jumanji", "WarGames"],
      chess: [
        "The Queen's Gambit",
        "Searching for Bobby Fischer",
        "Chess",
        "Computer Chess",
      ],
      cards: ["Casino", "Rounders", "The Gambler", "Casino Royale"],
      dice: ["The Dice Man", "Guys and Dolls", "Casino", "The Gambler"],
      board: ["Jumanji", "Clue", "The Game of Life", "Monopoly"],
      video: ["Ready Player One", "The Wizard", "Pixels", "Wreck-It Ralph"],
      toy: ["Toy Story", "Child's Play", "The Toy", "Toys"],
      doll: ["Child's Play", "Annabelle", "The Doll", "Dolls"],
      robot: ["I, Robot", "Wall-E", "Blade Runner", "Ex Machina"],
      machine: [
        "The Machine",
        "Ghost in the Machine",
        "Machine Gun Preacher",
        "The Time Machine",
      ],
      computer: ["The Matrix", "Her", "Ex Machina", "Tron"],
      phone: ["Phone Booth", "Cellular", "The Call", "Locke"],
      camera: [
        "Rear Window",
        "The Secret Life of Walter Mitty",
        "Paparazzi",
        "Shutter",
      ],
      television: ["The Truman Show", "Being There", "Network", "Videodrome"],
      radio: [
        "Good Morning Vietnam",
        "The Boat That Rocked",
        "Talk Radio",
        "Radio Days",
      ],
      microphone: [
        "A Star Is Born",
        "The Voice",
        "School of Rock",
        "Wayne's World",
      ],
      speaker: [
        "The Speaker",
        "Sound of Metal",
        "Baby Driver",
        "Almost Famous",
      ],
      headphones: ["Baby Driver", "Her", "Music and Lyrics", "High Fidelity"],

      // Tools and Equipment
      hammer: ["The Hammer", "Thor", "Oldboy", "Misery"],
      knife: ["Psycho", "Scream", "Halloween", "The Shining"],
      gun: ["John Wick", "Heat", "Collateral", "Pulp Fiction"],
      sword: ["Kill Bill", "The Princess Bride", "Gladiator", "Braveheart"],
      axe: ["The Shining", "American Psycho", "The Axe", "Fargo"],
      screwdriver: [
        "The Screwdriver",
        "Basic Instinct",
        "Fatal Attraction",
        "The Toolbox",
      ],
      wrench: ["The Wrench", "Clue", "The Mechanic", "Cars"],
      drill: ["The Drill", "There Will Be Blood", "Armageddon", "The Core"],
      saw: [
        "Saw",
        "The Texas Chain Saw Massacre",
        "Evil Dead",
        "The Hills Have Eyes",
      ],
      scissors: [
        "Edward Scissorhands",
        "Dead Ringers",
        "Black Swan",
        "The Shining",
      ],
      needle: [
        "The Needle",
        "Requiem for a Dream",
        "Trainspotting",
        "The Basketball Diaries",
      ],
      thread: ["The Thread", "Phantom Thread", "The Tailor", "A Single Thread"],
      rope: [
        "The Rope",
        "Vertical Limit",
        "Cliffhanger",
        "Mission: Impossible",
      ],
      chain: ["The Chain", "Django Unchained", "Chain Reaction", "Chained"],
      lock: ["The Lock", "Locke", "The Locksmith", "Locked Up"],
      key: ["The Key", "Skeleton Key", "The Keepers", "Key Largo"],
      door: ["The Door", "Monsters, Inc.", "The Doors", "Behind the Door"],
      window: ["Rear Window", "The Window", "Secret Window", "The Windows"],
      wall: ["The Wall", "Pink Floyd: The Wall", "The Great Wall", "Walls"],
      floor: ["The Floor", "The Ground Floor", "Groundhog Day", "The Flooring"],
      ceiling: ["The Ceiling", "The Glass House", "Upside Down", "Gravity"],
      roof: [
        "Fiddler on the Roof",
        "The Roof",
        "Cat on a Hot Tin Roof",
        "Rooftop",
      ],
      stairs: [
        "The Stairs",
        "Stairway to Heaven",
        "Spiral Staircase",
        "The Staircase",
      ],
      elevator: ["The Elevator", "Devil", "Speed", "The Lift"],
      ladder: [
        "The Ladder",
        "Ladder 49",
        "Jacob's Ladder",
        "The Ladder Theory",
      ],
      bridge: [
        "The Bridge",
        "Bridge to Terabithia",
        "A Bridge Too Far",
        "The Bridges of Madison County",
      ],
      tunnel: ["The Tunnel", "The Green Mile", "Tunnel Vision", "The Tunnels"],
      road: [
        "The Road",
        "Road to Perdition",
        "Revolutionary Road",
        "On the Road",
      ],
      path: ["The Path", "Garden State", "The Straight Story", "Pathfinder"],
      street: ["Sesame Street", "Wall Street", "Easy Street", "Street Smart"],
      sidewalk: [
        "The Sidewalk",
        "Sidewalks of New York",
        "Sidewalk Stories",
        "Side Street",
      ],
      crosswalk: [
        "The Crosswalk",
        "Crossing Over",
        "The Crossing",
        "Crossroads",
      ],
      intersection: ["The Intersection", "Crash", "Traffic", "The Crossroads"],
      corner: [
        "The Corner",
        "Around the Corner",
        "Cornered",
        "The Corner Store",
      ],
      alley: ["The Alley", "Blind Alley", "Alley Cat", "Bowling Alley"],
      square: ["Times Square", "The Square", "Red Square", "Washington Square"],
      circle: [
        "The Circle",
        "Full Circle",
        "Circle of Friends",
        "The Inner Circle",
      ],
      park: ["The Park", "Central Park", "Jurassic Park", "Park Avenue"],
      garden: [
        "The Secret Garden",
        "Garden State",
        "The Garden",
        "Midnight in the Garden",
      ],
      yard: ["The Yard", "The Longest Yard", "Graveyard Shift", "The Junkyard"],
      fence: ["The Fence", "Fences", "White Picket Fence", "The Fence Line"],
      gate: ["The Gate", "Heaven's Gate", "The Gates", "Stargate"],
      wall: [
        "The Wall",
        "Pink Floyd: The Wall",
        "The Great Wall",
        "Wall Street",
      ],
      barrier: ["The Barrier", "Crash", "The Great Barrier Reef", "Barriers"],
      sign: ["The Sign", "Signs", "Stop Sign", "The Signalman"],
      billboard: [
        "The Billboard",
        "Three Billboards Outside Ebbing, Missouri",
        "Billboard Dad",
        "The Billboard Effect",
      ],
      poster: [
        "The Poster",
        "Poster Boy",
        "The Poster Children",
        "Wanted Poster",
      ],
      banner: [
        "The Banner",
        "Banner in the Sky",
        "The Star-Spangled Banner",
        "Banner Year",
      ],
      flag: [
        "The Flag",
        "Flags of Our Fathers",
        "Capture the Flag",
        "The Confederate Flag",
      ],
      umbrella: [
        "The Umbrella",
        "Singin' in the Rain",
        "The Umbrella Academy",
        "My Umbrella",
      ],
      tent: ["The Tent", "Tent City", "The Circus Tent", "Camping Trip"],
      shelter: [
        "The Shelter",
        "Take Shelter",
        "Shelter Island",
        "Emergency Shelter",
      ],
      hut: ["The Hut", "Beach Hut", "The Pizza Hut", "Cabin in the Woods"],
      cabin: [
        "The Cabin",
        "Cabin in the Woods",
        "Cabin Fever",
        "The Cabin in the Cotton",
      ],
      cottage: [
        "The Cottage",
        "The Holiday",
        "Cottage Country",
        "Rose Cottage",
      ],
      mansion: [
        "The Mansion",
        "The Haunted Mansion",
        "Citizen Kane",
        "The Great Gatsby",
      ],
      palace: [
        "The Palace",
        "The Last Emperor",
        "The Princess Diaries",
        "Palace of Versailles",
      ],
      castle: [
        "The Castle",
        "Beauty and the Beast",
        "The Princess Bride",
        "Castle in the Sky",
      ],
      tower: [
        "The Tower",
        "The Dark Tower",
        "Tower Heist",
        "The Leaning Tower",
      ],
      skyscraper: [
        "Skyscraper",
        "Die Hard",
        "The Towering Inferno",
        "The Skyscraper",
      ],
      factory: [
        "The Factory",
        "Charlie and the Chocolate Factory",
        "Factory Girl",
        "The Factory Worker",
      ],
      warehouse: [
        "The Warehouse",
        "Reservoir Dogs",
        "The Warehouse District",
        "Storage Wars",
      ],
      garage: [
        "The Garage",
        "Garage Days",
        "The Garage Band",
        "Two-Car Garage",
      ],
      barn: ["The Barn", "Charlotte's Web", "The Barn Dance", "Barn Burning"],
      shed: ["The Shed", "Tool Shed", "The Potting Shed", "Shed No Tears"],
      greenhouse: [
        "The Greenhouse",
        "Little Shop of Horrors",
        "The Glass House",
        "Greenhouse Academy",
      ],
      library: [
        "The Library",
        "The Pagemaster",
        "The Librarian",
        "Library of Secrets",
      ],
      bookstore: [
        "The Bookstore",
        "You've Got Mail",
        "The Bookshop",
        "Bookstore Romance",
      ],
      museum: [
        "Night at the Museum",
        "The Museum",
        "Museum Hours",
        "The Natural History Museum",
      ],
      gallery: [
        "The Gallery",
        "Art Gallery",
        "The Picture Gallery",
        "Gallery of Horrors",
      ],
      theater: [
        "The Theater",
        "Shakespeare in Love",
        "The Phantom of the Opera",
        "Theater of Blood",
      ],
      cinema: [
        "Cinema Paradiso",
        "The Last Picture Show",
        "Hugo",
        "La La Land",
      ],
      concert: ["A Star Is Born", "Almost Famous", "The Concert", "This Is It"],
      stage: [
        "All the World's a Stage",
        "Stage Fright",
        "The Stage",
        "Center Stage",
      ],
      studio: ["The Studio", "Studio 54", "The Recording Studio", "Art Studio"],
      gym: ["Dodgeball", "Pumping Iron", "The Gym", "Gym Teacher"],
      pool: ["The Pool", "Swimming Pool", "Dead Pool", "The Pool Boy"],
      beach: ["The Beach", "Beach Party", "Beaches", "The Beach House"],
      desert: [
        "Lawrence of Arabia",
        "Mad Max: Fury Road",
        "The Desert",
        "Desert Hearts",
      ],
      forest: [
        "The Forest",
        "Into the Woods",
        "The Blair Witch Project",
        "Forest Gump",
      ],
      jungle: [
        "The Jungle Book",
        "Apocalypse Now",
        "The Jungle",
        "Jungle Fever",
      ],
      cave: [
        "The Cave",
        "The Descent",
        "Cave of Forgotten Dreams",
        "Batman Begins",
      ],
      mountain: [
        "The Mountain",
        "Brokeback Mountain",
        "The Mountain Between Us",
        "Cold Mountain",
      ],
      valley: [
        "Valley Girl",
        "How Green Was My Valley",
        "The Valley",
        "Valley of the Dolls",
      ],
      river: [
        "The River",
        "A River Runs Through It",
        "River's Edge",
        "The River Wild",
      ],
      lake: ["The Lake", "Lake Placid", "The Lake House", "Lady in the Lake"],
      pond: ["The Pond", "On Golden Pond", "The Pond Life", "Frog Pond"],
      waterfall: [
        "The Waterfall",
        "The Last of the Mohicans",
        "Waterfall",
        "Niagara",
      ],
      island: ["The Island", "Cast Away", "Shutter Island", "Treasure Island"],
      volcano: [
        "Volcano",
        "Joe Versus the Volcano",
        "Dante's Peak",
        "The Volcano",
      ],
      earthquake: ["San Andreas", "Earthquake", "The Big One", "Tremors"],
      fire: ["Backdraft", "Ladder 49", "The Fire", "On Fire"],
      smoke: [
        "Thank You for Smoking",
        "Smoke",
        "Up in Smoke",
        "Smokey and the Bandit",
      ],
      explosion: ["The Hurt Locker", "Speed", "Die Hard", "Armageddon"],
      lightning: [
        "Lightning",
        "Struck by Lightning",
        "The Lightning Thief",
        "Lightning McQueen",
      ],
      thunder: ["Thunder", "Days of Thunder", "Thunder Road", "Thunderbolt"],
      tornado: ["Twister", "Into the Storm", "The Tornado", "Tornado Alley"],
      hurricane: [
        "The Hurricane",
        "Hurricane",
        "The Perfect Storm",
        "Hurricane Season",
      ],
      snow: ["Snow White", "The Snow Queen", "Snow Day", "Let It Snow"],
      ice: ["Ice Age", "Thin Ice", "The Ice Storm", "Ice Princess"],
      frost: ["Frost/Nixon", "The Frost", "Jack Frost", "Frost Bite"],
      shadow: [
        "The Shadow",
        "What We Do in the Shadows",
        "Shadow of a Doubt",
        "In the Shadow",
      ],
      reflection: ["Black Swan", "The Machinist", "Mirrors", "Reflections"],
      silhouette: [
        "The Silhouette",
        "Silhouette of a Scream",
        "Shadow Play",
        "Dark Silhouette",
      ],
    };

    // Process each ViT label and find matching movies
    vitLabels.forEach((labelObj) => {
      const label = labelObj.label.toLowerCase();
      const confidence = labelObj.score;

      // Only use high-confidence predictions
      if (confidence > 0.1) {
        // Check for exact matches
        if (vitToMovieMap[label]) {
          console.log(
            `🎯 Found exact match for "${label}" (confidence: ${confidence.toFixed(
              2
            )})`
          );
          vitToMovieMap[label].forEach((movie) => {
            if (!movieRecommendations.includes(movie)) {
              movieRecommendations.push(movie);
            }
          });
        }

        // Check for partial matches
        Object.keys(vitToMovieMap).forEach((key) => {
          if (key.includes(label) || label.includes(key)) {
            console.log(
              `🎯 Found partial match for "${label}" -> "${key}" (confidence: ${confidence.toFixed(
                2
              )})`
            );
            vitToMovieMap[key].forEach((movie) => {
              if (!movieRecommendations.includes(movie)) {
                movieRecommendations.push(movie);
              }
            });
          }
        });
      }
    });

    console.log(
      `🎬 ViT analysis generated ${movieRecommendations.length} movie recommendations`
    );
    return movieRecommendations;
  }

  generateIntelligentFallback(userPrompt, mood) {
    console.log("🎭 Generating intelligent fallback recommendations");

    const fallbackMovies = [
      "The Shawshank Redemption",
      "The Godfather",
      "The Dark Knight",
      "Pulp Fiction",
      "Forrest Gump",
      "Inception",
      "Fight Club",
      "The Matrix",
      "Goodfellas",
      "Se7en",
      "The Silence of the Lambs",
      "Saving Private Ryan",
      "Schindler's List",
      "One Flew Over the Cuckoo's Nest",
      "Casablanca",
      "Lawrence of Arabia",
      "Psycho",
      "Sunset Boulevard",
      "Vertigo",
      "Citizen Kane",
    ];

    // Add mood-specific movies
    if (mood) {
      const moodSpecific = {
        action: ["Mad Max: Fury Road", "John Wick", "Die Hard", "The Raid"],
        comedy: [
          "The Grand Budapest Hotel",
          "Parasite",
          "Knives Out",
          "Jojo Rabbit",
        ],
        drama: [
          "Manchester by the Sea",
          "Moonlight",
          "Her",
          "The Social Network",
        ],
        horror: ["The Conjuring", "Hereditary", "Get Out", "A Quiet Place"],
        romance: ["The Notebook", "Titanic", "La La Land", "Her"],
        "sci-fi": [
          "Blade Runner 2049",
          "Arrival",
          "Ex Machina",
          "Interstellar",
        ],
        thriller: ["Gone Girl", "Zodiac", "Prisoners", "Shutter Island"],
        dark: [
          "Joker",
          "Taxi Driver",
          "There Will Be Blood",
          "No Country for Old Men",
        ],
      };

      const moodKey = mood.toLowerCase().replace(/[^a-z]/g, "");
      if (moodSpecific[moodKey]) {
        fallbackMovies.push(...moodSpecific[moodKey]);
      }
    }

    // Add user prompt-specific movies
    if (userPrompt) {
      const lowerPrompt = userPrompt.toLowerCase();
      if (lowerPrompt.includes("psychological")) {
        fallbackMovies.push(
          "Black Swan",
          "Shutter Island",
          "Memento",
          "The Machinist"
        );
      }
      if (lowerPrompt.includes("thriller")) {
        fallbackMovies.push("Gone Girl", "Zodiac", "Prisoners", "Se7en");
      }
      if (lowerPrompt.includes("dark")) {
        fallbackMovies.push(
          "Joker",
          "Taxi Driver",
          "There Will Be Blood",
          "Nightcrawler"
        );
      }
    }

    // Remove duplicates and return
    return [...new Set(fallbackMovies)];
  }

  // Test ViT connectivity
  async testViTConnection() {
    try {
      if (!this.apiToken || this.apiToken === "your_huggingface_token_here") {
        return {
          success: false,
          message: "Hugging Face API token not configured",
        };
      }

      // Simple test - just check if model endpoint exists
      const response = await this.client.get("/google/vit-base-patch16-224");

      return {
        success: true,
        message: "ViT model is available and ready",
      };
    } catch (error) {
      return {
        success: false,
        message: `ViT model connection failed: ${
          error.response?.status || error.message
        }`,
      };
    }
  }
}

module.exports = new HuggingFaceAIService();
