import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { SearchContext } from "./SearchContext";
import { agra, ahmedabad, ajanta, alleppey, amarnath, amritsar, ayodhya, badrinath, bengaluru, bhopal, bhubaneswar, bikaner, bodhGaya, chandigarh, chennai, cherrapunji, chittorgarh, coorg, darjelling, deoghar, dharamshala, diu, dudhsagar, dwarka, dzukou, ellora, gangotri, gangtok, gir, goa, guwahati, hampi, haridwar, hyderabad, indore, jabalpur, jaipur, jaisalmer, jibhi, jodhpur, kalpa, kanchipuram, kanyakumari, kasol, kaziranga, kedarnath, khajjiar, khajuraho, kochi, kohima, kolkata, konark, kutch, lakshadweep, leh, lucknow, madurai, mahabalipuram, manali, mountAbu, mumbai, munnar, munsiyari, mussoorie, mysuru, nainital, pangong, pondicherry, portBlair, prayagraj, pune, puri, pushkar, rameswaram, redFort, rishikesh, shillong, shimla, shirdi, spiti, srinagar, statueOfUnity, sundarbans, surat, tawang, thiruvananthapuram, tirupati, udaipur, udupi, ujjain, vadodara, vaishnoDevi, valleyOfFlowers, varanasi, vijayawada, vrindavan, warangal, yamunotri } from "./utils/mapMarker";


function ZoomListener({ onZoomChange }) {
  const map = useMap();

  const handleZoomEnd = () => {
    onZoomChange(map.getZoom());
  };

  map.on("zoomend", handleZoomEnd);

  return null;
}

function Explore() {
  const navigate = useNavigate();
  const { setSelectedPlace } = useContext(SearchContext);
  const [currentZoom, setCurrentZoom] = useState(5);

  const touristPlaces = [
    {
      id: "kolkata",
      name: "Kolkata",
      description: "Cultural Capital of India",
      coords: [22.5726, 88.3639],
      icon: kolkata,
      minZoom: 3
    },
    {
      id: "mumbai",
      name: "Mumbai",
      description: "Gateway to India's west coast",
      coords: [19.0760, 72.8777],
      icon: mumbai,
      minZoom: 3
    },
    {
      id: "delhi",
      name: "Delhi",
      description: "Capital of India",
      coords: [28.6139, 77.2090],
      icon: redFort,
      minZoom: 3
    },
        {
      id: "bengaluru",
      name: "Bengaluru",
      description: "Garden City and tech capital",
      coords: [12.9716, 77.5946],
      icon: bengaluru,
      minZoom: 3
    },
    {
      id: "agra",
      name: "Agra",
      description: "Home of the Taj Mahal",
      coords: [27.1767, 78.0081],
      icon: agra,
      minZoom: 5
    },
    {
      id: "udaipur",
      name: "Udaipur",
      description: "City of Lakes",
      coords: [24.5854, 73.7125],
      icon: udaipur,
      minZoom: 5
    },
    {
      id: "jaipur",
      name: "Jaipur",
      description: "The Pink City",
      coords: [26.9124, 75.7873],
      icon: jaipur,
      minZoom: 6
    },
    {
      id: "hyderabad",
      name: "Hyderabad",
      description: "City of Pearls",
      coords: [17.3850, 78.4867],
      icon: hyderabad,
      minZoom: 4
    },
    {
      id: "amritsar",
      name: "Amritsar",
      description: "Home of the Golden Temple",
      coords: [31.6340, 74.8723],
      icon: amritsar,
      minZoom: 4
    },
    {
      id: "panaji",
      name: "panaji",
      description: "India's Beach Paradise",
      coords: [15.4909, 73.8278],
      icon: goa,
      minZoom: 4
    },
    {
      id: "mysuru",
      name: "Mysuru",
      description: "City of Palaces",
      coords: [12.2958, 76.6394],
      icon: mysuru,
      minZoom: 6
    },
    {
      id: "srinagar",
      name: "Srinagar",
      description: "Paradise on Earth",
      coords: [34.0837, 74.7973],
      icon: srinagar,
      minZoom: 6
    },
    {
      id: "varanasi",
      name: "Varanasi",
      description: "Spiritual Heart of India",
      coords: [25.3176, 82.9739],
      icon: varanasi,
      minZoom: 6
    },
    {
      id: "jodhpur",
      name: "Jodhpur",
      description: "The Blue City",
      coords: [26.2389, 73.0243],
      icon: jodhpur,
      minZoom: 6
    },
    {
      id: "kochi",
      name: "Kochi",
      description: "Queen of the Arabian Sea",
      coords: [9.9312, 76.2673],
      icon: kochi,
      minZoom: 6
    },
    {
      id: "rishikesh",
      name: "Rishikesh",
      description: "Yoga Capital of the World",
      coords: [30.0869, 78.2676],
      icon: rishikesh,
      minZoom: 6
    },
    {
      id: "shimla",
      name: "Shimla",
      description: "Historic Hill Station",
      coords: [31.1048, 77.1734],
      icon: shimla,
      minZoom: 6
    },
    {
      id: "darjeeling",
      name: "Darjeeling",
      description: "Famous Tea Gardens",
      coords: [27.0360, 88.2627],
      icon: darjelling,
      minZoom: 6
    },
    {
      id: "manali",
      name: "Manali",
      description: "Popular Himalayan Retreat",
      coords: [32.2432, 77.1892],
      icon: manali,
      minZoom: 6
    },
    {
      id: "puri",
      name: "Puri",
      description: "The sacred city of lord Jagannath",
      coords: [19.8135, 85.8312],
      icon: puri,
      minZoom: 6
    },
    {
      id: "bhubaneswar",
      name: "Bhubaneswar",
      description: "Temple City of India",
      coords: [20.2961, 85.8245],
      icon: bhubaneswar,
      minZoom: 6
    },
    {
      id: "gangtok",
      name: "Gangtok",
      description: "Gateway to the Eastern Himalayas",
      coords: [27.3389, 88.6065],
      icon: gangtok,
      minZoom: 6
    },
    {
      id: "nainital",
      name: "Nainital",
      description: "Scenic lake town",
      coords: [29.3919, 79.4542],
      icon: nainital,
      minZoom: 6
    },
    {
      id: "mussoorie",
      name: "Mussoorie",
      description: "Queen of the Hills",
      coords: [30.4598, 78.0644],
      icon: mussoorie,
      minZoom: 6
    },
    {
      id: "khajuraho",
      name: "Khajuraho",
      description: "UNESCO temple complex",
      coords: [24.8318, 79.9199],
      icon: khajuraho,
      minZoom: 6
    },
    {
      id: "bhopal",
      name: "Bhopal",
      description: "City of Lakes",
      coords: [23.2599, 77.4126],
      icon: bhopal,
      minZoom: 6
    },
    {
      id: "ahmedabad",
      name: "Ahmedabad",
      description: "Historic walled city",
      coords: [23.0225, 72.5714],
      icon: ahmedabad,
      minZoom: 6
    },
    {
      id: "dwarka",
      name: "Dwarka",
      description: "Ancient Krishna pilgrimage site",
      coords: [22.2442, 68.9685],
      icon: dwarka,
      minZoom: 6
    },
    {
      id: "hampi",
      name: "Hampi",
      description: "Ruins of the Vijayanagara Empire",
      coords: [15.3350, 76.4600],
      icon: hampi,
      minZoom: 6
    },
    {
      id: "coorg",
      name: "Coorg",
      description: "Coffee hills of Karnataka",
      coords: [12.3375, 75.8069],
      icon: coorg,
      minZoom: 6
    },
    {
      id: "pondicherry",
      name: "Pondicherry",
      description: "French colonial seaside town",
      coords: [11.9416, 79.8083],
      icon: pondicherry,
      minZoom: 6
    },
    {
      id: "tawang",
      name: "Tawang",
      description: "Monastery town in Arunachal",
      coords: [27.5866, 91.8639],
      icon: tawang,
      minZoom: 6
    },
    {
      id: "shillong",
      name: "Shillong",
      description: "Scotland of the East",
      coords: [25.5788, 91.8933],
      icon: shillong,
      minZoom: 6
    },
    {
      id: "kaziranga",
      name: "Kaziranga",
      description: "Home of the one-horned rhino",
      coords: [26.5775, 93.1711],
      icon: kaziranga,
      minZoom: 6
    },
    {
      id: "port-blair",
      name: "Port Blair",
      description: "Capital of the Andaman Islands",
      coords: [11.6234, 92.7265],
      icon: portBlair,
      minZoom: 6
    },
    {
      id: "leh",
      name: "Leh",
      description: "Gateway to Ladakh",
      coords: [34.1526, 77.5771],
      icon: leh,
      minZoom: 6
    },
    {
      id: "kanyakumari",
      name: "Kanyakumari",
      description: "Southern tip of India",
      coords: [8.0883, 77.5385],
      icon: kanyakumari,
      minZoom: 6
    },
    {
      id: "madurai",
      name: "Madurai",
      description: "Ancient temple city",
      coords: [9.9252, 78.1198],
      icon: madurai,
      minZoom: 6
    },
    {
      id: "tirupati",
      name: "Tirupati",
      description: "Famous pilgrimage destination",
      coords: [13.6288, 79.4192],
      icon: tirupati,
      minZoom: 6
    },
    {
      id: "vijayawada",
      name: "Vijayawada",
      description: "City on the Krishna River",
      coords: [16.5062, 80.6480],
      icon: vijayawada,
      minZoom: 6
    },
    {
      id: "mahabalipuram",
      name: "Mahabalipuram",
      description: "UNESCO shore temples",
      coords: [12.6208, 80.1931],
      icon: mahabalipuram,
      minZoom: 6
    },
    {
      id: "ajanta",
      name: "Ajanta",
      description: "Ancient Buddhist cave paintings",
      coords: [20.5519, 75.7033],
      icon: ajanta,
      minZoom: 6
    },
    {
      id: "ellora",
      name: "Ellora",
      description: "Rock-cut cave temples",
      coords: [20.0268, 75.1790],
      icon: ellora,
      minZoom: 6
    },
    {
      id: "chittorgarh",
      name: "Chittorgarh",
      description: "India's largest fort complex",
      coords: [24.8887, 74.6269],
      icon: chittorgarh,
      minZoom: 6
    },
    {
      id: "mount_abu",
      name: "Mount Abu",
      description: "Rajasthan's only hill station",
      coords: [24.5926, 72.7156],
      icon: mountAbu,
      minZoom: 6
    },
    {
      id: "bikaner",
      name: "Bikaner",
      description: "The city of karni mata and junagarh",
      coords: [28.0229, 73.3119],
      icon: bikaner,
      minZoom: 6
    },
    {
      id: "jaisalmer",
      name: "Jaisalmer",
      description: "The Golden City",
      coords: [26.9157, 70.9083],
      icon: jaisalmer,
      minZoom: 6
    },
    {
      id: "dharamshala",
      name: "Dharamshala",
      description: "Home of the Dalai Lama",
      coords: [32.2190, 76.3234],
      icon: dharamshala,
      minZoom: 6
    },
    {
      id: "spiti",
      name: "Spiti Valley",
      description: "Cold desert of the Himalayas",
      coords: [32.2460, 78.0347],
      icon: spiti,
      minZoom: 6
    },
    {
      id: "kedarnath",
      name: "Kedarnath",
      description: "Sacred Himalayan shrine of shiva",
      coords: [30.7352, 79.0669],
      icon: kedarnath,
      minZoom: 6
    },
    {
      id: "badrinath",
      name: "Badrinath",
      description: "Ancient Vishnu pilgrimage site",
      coords: [30.7433, 79.4938],
      icon: badrinath,
      minZoom: 6
    },
    {
      id: "cherrapunji",
      name: "Cherrapunji",
      description: "Land of living root bridges",
      coords: [25.2702, 91.7322],
      icon: cherrapunji,
      minZoom: 6
    },
    {
      id: "lakshadweep",
      name: "Lakshadweep",
      description: "Coral islands of India",
      coords: [10.5667, 72.6417],
      icon: lakshadweep,
      minZoom: 6
    },
    {
      id: "konark",
      name: "Konark",
      description: "Famous Sun Temple",
      coords: [19.8876, 86.0945],
      icon: konark,
      minZoom: 6
    },
    {
      id: "sundarbans",
      name: "Sundarbans",
      description: "Largest mangrove forest",
      coords: [21.9497, 89.1833],
      icon: sundarbans,
      minZoom: 6
    },
    {
      id: "alleppey",
      name: "Alleppey",
      description: "Backwater capital of Kerala",
      coords: [9.4981, 76.3388],
      icon: alleppey,
      minZoom: 6
    },
    {
      id: "munnar",
      name: "Munnar",
      description: "Tea gardens of Kerala",
      coords: [10.0889, 77.0595],
      icon: munnar,
      minZoom: 6

    },
    {
      id: "rameswaram",
      name: "Rameswaram",
      description: "Sacred jyotirlinga of shiva",
      coords: [9.2876, 79.3129],
      icon: rameswaram,
      minZoom: 6
    },
    {
      id: "statue_of_unity",
      name: "Statue of Unity",
      description: "World's tallest statue",
      coords: [21.8380, 73.7191],
      icon: statueOfUnity,
      minZoom: 6
    },
    {
      id: "jabalpur",
      name: "Jabalpur",
      description: "Marble Rocks and waterfalls",
      coords: [23.1815, 79.9864],
      icon: jabalpur,
      minZoom: 6
    },
    {
      id: "pushkar",
      name: "Pushkar",
      description: "Holy lake and Brahma Temple",
      coords: [26.4897, 74.5511],
      icon: pushkar,
      minZoom: 6
    },
    {
      id: "vrindavan",
      name: "Vrindavan",
      description: "Sacred Krishna pilgrimage town",
      coords: [27.5806, 77.7000],
      icon: vrindavan,
      minZoom: 6
    },
    {
      id: "prayagraj",
      name: "Prayagraj",
      description: "Triveni Sangam city",
      coords: [25.4358, 81.8463],
      icon: prayagraj,
      minZoom: 6
    },
    {
      id: "ayodhya",
      name: "Ayodhya",
      description: "Birthplace of Lord Rama",
      coords: [26.7999, 82.2042],
      icon: ayodhya,
      minZoom: 6
    },
    {
      id: "bodh_gaya",
      name: "Bodh Gaya",
      description: "Place of Buddha's enlightenment",
      coords: [24.6950, 84.9910],
      icon: bodhGaya,
      minZoom: 6
    },
    {
      id: "deoghar",
      name: "Deoghar",
      description: "Home of Baidyanath Temple",
      coords: [24.4829, 86.6996],
      icon: deoghar,
      minZoom: 6
    },
    {
      id: "yamunotri",
      name: "Yamunotri",
      description: "Source of River Yamuna",
      coords: [31.0140, 78.4598],
      icon: yamunotri,
      minZoom: 6
    },
    {
      id: "gangotri",
      name: "Gangotri",
      description: "Source of River Ganga",
      coords: [30.9947, 78.9398],
      icon: gangotri,
      minZoom: 6
    },
    {
      id: "diu",
      name: "Diu",
      description: "Island fort and beaches",
      coords: [20.7144, 70.9874],
      icon: diu,
      minZoom: 6
    },
    {
      id: "gir",
      name: "Gir National Park",
      description: "Last home of Asiatic lions",
      coords: [21.1240, 70.8240],
      icon: gir,
      minZoom: 6
    },
    {
      id: "kutch",
      name: "Rann of Kutch",
      description: "Vast white salt desert",
      coords: [23.7337, 69.8597],
      icon: kutch,
      minZoom: 6
    },
    {
      id: "shirdi",
      name: "Shirdi",
      description: "Pilgrimage town of Sai Baba",
      coords: [19.7645, 74.4774],
      icon: shirdi,
      minZoom: 6
    },
    {
      id: "warangal",
      name: "Warangal",
      description: "Historic Kakatiya capital",
      coords: [17.9689, 79.5941],
      icon: warangal,
      minZoom: 6
    },
    {
      id: "valley_of_flowers",
      name: "Valley of Flowers",
      description: "UNESCO alpine flower valley",
      coords: [30.7280, 79.6050],
      icon: valleyOfFlowers,
      minZoom: 6
    },
    {
      id: "kasol",
      name: "Kasol",
      description: "Popular Parvati Valley retreat",
      coords: [32.0090, 77.3140],
      icon: kasol,
      minZoom: 6
    },
    {
      id: "khajjiar",
      name: "Khajjiar",
      description: "Mini Switzerland of India",
      coords: [32.5490, 76.0620],
      icon: khajjiar,
      minZoom: 6
    },
    {
      id: "pangong",
      name: "Pangong Lake",
      description: "Famous high-altitude lake",
      coords: [34.0915, 78.4411],
      icon: pangong,
      minZoom: 6
    },
    {
      id: "dzukou",
      name: "Dzukou Valley",
      description: "Famous trekking destination",
      coords: [25.5667, 94.1000],
      icon: dzukou,
      minZoom: 6
    },
    {
      id: "chennai",
      name: "Chennai",
      description: "Gateway to South India",
      coords: [13.0827, 80.2707],
      icon: chennai,
      minZoom: 6
    },
    {
      id: "pune",
      name: "Pune",
      description: "Cultural capital of Maharashtra",
      coords: [18.5204, 73.8567],
      icon: pune,
      minZoom: 6
    },
    {
      id: "lucknow",
      name: "Lucknow",
      description: "City of Nawabs",
      coords: [26.8467, 80.9462],
      icon: lucknow,
      minZoom: 6
    },
    {
      id: "chandigarh",
      name: "Chandigarh",
      description: "India's planned city",
      coords: [30.7333, 76.7794],
      icon: chandigarh,
      minZoom: 6
    },
    {
      id: "indore",
      name: "Indore",
      description: "Food capital of Madhya Pradesh",
      coords: [22.7196, 75.8577],
      icon: indore,
      minZoom: 6
    },
    {
      id: "vadodara",
      name: "Vadodara",
      description: "City of palaces and culture",
      coords: [22.3072, 73.1812],
      icon: vadodara,
      minZoom: 6
    },
    {
      id: "guwahati",
      name: "Guwahati",
      description: "Gateway to Northeast India",
      coords: [26.1445, 91.7362],
      icon: guwahati,
      minZoom: 6
    },
    {
      id: "ujjain",
      name: "Ujjain",
      description: "Home of Mahakaleshwar Jyotirlinga",
      coords: [23.1765, 75.7885],
      icon: ujjain,
      minZoom: 6
    },
    {
      id: "vaishno_devi",
      name: "Vaishno Devi",
      description: "One of India's holiest shrines",
      coords: [33.0308, 74.9496],
      icon: vaishnoDevi,
      minZoom: 6
    },
    {
      id: "haridwar",
      name: "Haridwar",
      description: "Gateway to the Char Dham",
      coords: [29.9457, 78.1642],
      icon: haridwar,
      minZoom: 6
    },
    {
      id: "amarnath",
      name: "Amarnath",
      description: "Sacred cave shrine of Shiva",
      coords: [34.2140, 75.5020],
      icon: amarnath,
      minZoom: 6
    },
    {
      id: "dudhsagar",
      name: "Dudhsagar Falls",
      description: "Majestic four-tier waterfall",
      coords: [15.3144, 74.3148],
      icon: dudhsagar,
      minZoom: 6
    },
    {
      id: "kanchipuram",
      name: "Kanchipuram",
      description: "City of a Thousand Temples",
      coords: [12.8342, 79.7036],
      icon: kanchipuram,
      minZoom: 6
    },
    {
      id: "kohima",
      name: "Kohima",
      description: "Hill capital of Nagaland",
      coords: [25.6751, 94.1086],
      icon: kohima,
      minZoom: 6
    },
    {
      id: "udupi",
      name: "Udupi",
      description: "Famous Krishna temple town",
      coords: [13.3409, 74.7421],
      icon: udupi,
      minZoom: 6
    },
    {
      id: "kalpa",
      name: "Kalpa",
      description: "Himalayan village with Kinnaur views",
      coords: [31.5383, 78.2516],
      icon: kalpa,
      minZoom: 6
    },
    {
      id: "jibhi",
      name: "Jibhi",
      description: "Peaceful Himalayan village retreat",
      coords: [31.5884, 77.3453],
      icon: jibhi,
      minZoom: 6
    },
    {
      id: "munsiyari",
      name: "Munsiyari",
      description: "Gateway to the Panchachuli Peaks",
      coords: [30.0674, 80.2386],
      icon: munsiyari,
      minZoom: 6
    },
    {
      id: "thiruvananthapuram",
      name: "Thiruvananthapuram",
      description: "Capital city of Kerala",
      coords: [8.5241, 76.9366],
      icon: thiruvananthapuram,
      minZoom: 6
    }
  ];

  return (
    <div className="w-screen h-[calc(100vh-121px)]">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomListener onZoomChange={setCurrentZoom} />

        {touristPlaces
          .filter((place) => currentZoom >= place.minZoom)
          .map((place) => (
            <Marker key={place.id} position={place.coords} icon={place.icon}>
              <Popup>
                <div className="w-56 space-y-3 text-sm">
                  <div className="flex items-center justify-evenly gap-3">
                    <img
                      src={place.icon.options.iconUrl}
                      alt={`${place.name} marker`}
                      className="h-12 w-12 rounded-md"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{place.name}</div>
                      <div className="text-gray-600 text-xs">{place.description}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlace({ properties: { name: place.name } });
                      navigate("/planyourtrip");
                    }}
                    className="w-full rounded-full bg-teal-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-teal-700 transition"
                  >
                    Start a trip
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}

export default Explore;
