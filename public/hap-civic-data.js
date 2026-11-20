/**
 * Himachal Accountability Project (HAP) — Civic Data Registry
 * Modeled on YouthPOWER (youthpower.in) mechanisms & adapted for Himachal Pradesh.
 * 
 * Provides:
 * - 12 District Accountability Scores (0–100) & 5 Pillars
 * - 68 Assembly Constituency MLAs (INC: 40, BJP: 28, IND: 0)
 * - 1-Click WhatsApp & Email outreach generators
 * - Side-by-side comparison helpers & CSV data exporter
 * 
 * Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
 */

const HAP_PILLARS = [
  { key: "roads",  name: "Roads & Connectivity",   short: "Roads",   icon: "🛣️", desc: "PWD link roads, highway maintenance, landslide clearance, potholes" },
  { key: "water",  name: "Water & Jal Shakti",       short: "Water",   icon: "💧", desc: "Drinking water pipes, irrigation canals, Jal Jeevan Mission supply" },
  { key: "health", name: "Healthcare & Hospitals",   short: "Health",  icon: "🏥", desc: "Civil hospital staffing, doctor vacancies, OPD queues, dispensaries" },
  { key: "power",  name: "Power & Electricity",      short: "Power",   icon: "⚡", desc: "HPSEBL transformers, voltage drops, power cuts, line maintenance" },
  { key: "youth",  name: "Youth & Employment",       short: "Youth",   icon: "🎓", desc: "Public sector job vacancies, exam scheduling, local enterprise support" }
];

const HAP_DISTRICTS = {
  "Lahaul & Spiti": {
    "score": 78.4,
    "rank": 1,
    "neglect": 50,
    "count": 12,
    "top": "Roads",
    "tier": "High Responsiveness",
    "seats": [
      21
    ],
    "pwd": 72,
    "water": 82,
    "health": 80,
    "power": 76,
    "youth": 82,
    "tehsils": [
      "Keylong",
      "Udaipur",
      "Kaza",
      "Spiti"
    ],
    "ls": "Mandi",
    "summary": "Lowest unresolved rate (50%) in Himachal. Rapid seasonal snow clearance and high administrative responsiveness.",
    "incSeats": 1,
    "bjpSeats": 0,
    "name": "Lahaul & Spiti"
  },
  "Kinnaur": {
    "score": 71.2,
    "rank": 2,
    "neglect": 55,
    "count": 18,
    "top": "Power",
    "tier": "High Responsiveness",
    "seats": [
      68
    ],
    "pwd": 68,
    "water": 75,
    "health": 74,
    "power": 65,
    "youth": 73,
    "tehsils": [
      "Kalpa",
      "Pooh",
      "Nichar",
      "Sangla"
    ],
    "ls": "Mandi",
    "summary": "Strong performance in Jal Shakti water supply; hydropower transmission disruptions remain primary civic concern.",
    "incSeats": 1,
    "bjpSeats": 0,
    "name": "Kinnaur"
  },
  "Kullu": {
    "score": 67.5,
    "rank": 3,
    "neglect": 58,
    "count": 42,
    "top": "Roads",
    "tier": "Moderate Action",
    "seats": [
      22,
      23,
      24,
      25
    ],
    "pwd": 62,
    "water": 71,
    "health": 69,
    "power": 70,
    "youth": 65,
    "tehsils": [
      "Kullu",
      "Manali",
      "Banjar",
      "Anni",
      "Nirmand"
    ],
    "ls": "Mandi",
    "summary": "Tourism corridor connectivity recovery ongoing. Moderate grievance resolution with NH-3 and link roads leading complaints.",
    "incSeats": 2,
    "bjpSeats": 2,
    "name": "Kullu"
  },
  "Chamba": {
    "score": 63.8,
    "rank": 4,
    "neglect": 61,
    "count": 38,
    "top": "Roads",
    "tier": "Moderate Action",
    "seats": [
      1,
      2,
      3,
      4,
      5
    ],
    "pwd": 58,
    "water": 66,
    "health": 64,
    "power": 68,
    "youth": 63,
    "tehsils": [
      "Chamba",
      "Bharmour",
      "Churah",
      "Salooni",
      "Bhattiyat",
      "Dalhousie"
    ],
    "ls": "Kangra / Mandi",
    "summary": "Tribal corridor NH-154A connectivity at Dharwala and remote valley healthcare access are key unaddressed issues.",
    "incSeats": 2,
    "bjpSeats": 3,
    "name": "Chamba"
  },
  "Hamirpur": {
    "score": 61.2,
    "rank": 5,
    "neglect": 63,
    "count": 36,
    "top": "Roads",
    "tier": "Moderate Action",
    "seats": [
      36,
      37,
      38,
      39,
      40
    ],
    "pwd": 60,
    "water": 64,
    "health": 62,
    "power": 61,
    "youth": 59,
    "tehsils": [
      "Hamirpur",
      "Nadaun",
      "Barsar",
      "Bhoranj",
      "Sujanpur"
    ],
    "ls": "Hamirpur",
    "summary": "High literacy district with notable youth unemployment reports and delayed PWD link road execution.",
    "incSeats": 3,
    "bjpSeats": 2,
    "name": "Hamirpur"
  },
  "Mandi": {
    "score": 58.6,
    "rank": 6,
    "neglect": 65,
    "count": 64,
    "top": "Roads",
    "tier": "Moderate Action",
    "seats": [
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35
    ],
    "pwd": 54,
    "water": 62,
    "health": 60,
    "power": 63,
    "youth": 54,
    "tehsils": [
      "Mandi Sadar",
      "Sundernagar",
      "Karsog",
      "Jogindernagar",
      "Sarkaghat",
      "Gohar",
      "Thunag"
    ],
    "ls": "Mandi",
    "summary": "Major geographic hub with 10 assembly seats. Highway widening delays and rural healthcare staffing drive grievances.",
    "incSeats": 1,
    "bjpSeats": 9,
    "name": "Mandi"
  },
  "Bilaspur": {
    "score": 56.4,
    "rank": 7,
    "neglect": 67,
    "count": 28,
    "top": "Roads",
    "tier": "Moderate Action",
    "seats": [
      46,
      47,
      48,
      49
    ],
    "pwd": 52,
    "water": 58,
    "health": 59,
    "power": 60,
    "youth": 53,
    "tehsils": [
      "Bilaspur Sadar",
      "Ghumarwin",
      "Jhanduta",
      "Naina Devi"
    ],
    "ls": "Hamirpur",
    "summary": "AIIMS Kothipura operational benefits offset by Kiratpur-Nerchowk bypass rehabilitation and water distribution disputes.",
    "incSeats": 1,
    "bjpSeats": 3,
    "name": "Bilaspur"
  },
  "Kangra": {
    "score": 53.8,
    "rank": 8,
    "neglect": 69,
    "count": 82,
    "top": "Roads",
    "tier": "Moderate Action",
    "seats": [
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20
    ],
    "pwd": 50,
    "water": 55,
    "health": 57,
    "power": 58,
    "youth": 49,
    "tehsils": [
      "Dharamshala",
      "Kangra",
      "Palampur",
      "Nurpur",
      "Dehra",
      "Jawali",
      "Baijnath",
      "Shahpur"
    ],
    "ls": "Kangra",
    "summary": "Largest district with 15 assembly constituencies. High volume of unaddressed revenue road disputes and youth unemployment.",
    "incSeats": 10,
    "bjpSeats": 5,
    "name": "Kangra"
  },
  "Sirmaur": {
    "score": 51.0,
    "rank": 9,
    "neglect": 69,
    "count": 34,
    "top": "Health",
    "tier": "Moderate Action",
    "seats": [
      55,
      56,
      57,
      58,
      59
    ],
    "pwd": 49,
    "water": 52,
    "health": 48,
    "power": 56,
    "youth": 50,
    "tehsils": [
      "Nahan",
      "Paonta Sahib",
      "Rajgarh",
      "Sangrah",
      "Shillai",
      "Pachhad"
    ],
    "ls": "Shimla",
    "summary": "Trans-Giri remote belts face acute healthcare doctor vacancies and unpaved arterial corridors.",
    "incSeats": 3,
    "bjpSeats": 2,
    "name": "Sirmaur"
  },
  "Solan": {
    "score": 48.5,
    "rank": 10,
    "neglect": 71,
    "count": 45,
    "top": "Roads",
    "tier": "Severe Neglect",
    "seats": [
      50,
      51,
      52,
      53,
      54
    ],
    "pwd": 44,
    "water": 50,
    "health": 52,
    "power": 48,
    "youth": 48,
    "tehsils": [
      "Solan",
      "Kasauli",
      "Nalagarh",
      "Arki",
      "Kandaghat",
      "Baddi"
    ],
    "ls": "Shimla",
    "summary": "Baddi-Barotiwala-Nalagarh industrial belt reports severe effluent pollution, cratered truck corridors, and water contamination.",
    "incSeats": 5,
    "bjpSeats": 0,
    "name": "Solan"
  },
  "Shimla": {
    "score": 45.2,
    "rank": 11,
    "neglect": 73,
    "count": 56,
    "top": "Roads",
    "tier": "Severe Neglect",
    "seats": [
      60,
      61,
      62,
      63,
      64,
      65,
      66,
      67
    ],
    "pwd": 42,
    "water": 47,
    "health": 45,
    "power": 49,
    "youth": 43,
    "tehsils": [
      "Shimla Urban",
      "Shimla Rural",
      "Theog",
      "Chopal",
      "Rampur",
      "Rohru",
      "Jubbal"
    ],
    "ls": "Shimla",
    "summary": "State capital paradox: despite administrative proximity, 73% unresolved rate across apple-belt link roads and hospital queues.",
    "incSeats": 7,
    "bjpSeats": 1,
    "name": "Shimla"
  },
  "Una": {
    "score": 41.8,
    "rank": 12,
    "neglect": 74,
    "count": 47,
    "top": "Health",
    "tier": "Severe Neglect",
    "seats": [
      41,
      42,
      43,
      44,
      45
    ],
    "pwd": 40,
    "water": 44,
    "health": 39,
    "power": 46,
    "youth": 40,
    "tehsils": [
      "Una",
      "Amb",
      "Haroli",
      "Bangana",
      "Gagret"
    ],
    "ls": "Hamirpur",
    "summary": "Highest unresolved grievance rate (74%). Stalled Civil Hospital works and rampant mining riverbed damages.",
    "incSeats": 4,
    "bjpSeats": 1,
    "name": "Una"
  }
};

const HAP_MLAS = [
  {
    "no": 1,
    "constituency": "Churah (SC)",
    "district": "Chamba",
    "mla": "Hans Raj",
    "party": "BJP",
    "reports": 2,
    "neglect": 61,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Churah (SC).",
    "pincode": "176310",
    "email": "hans.raj@hpvidhansabha.nic.in"
  },
  {
    "no": 2,
    "constituency": "Bharmour (ST)",
    "district": "Chamba",
    "mla": "Dr. Janak Raj",
    "party": "BJP",
    "reports": 1,
    "neglect": 61,
    "dominantIssue": "Roads",
    "problem": "Collapse of NH-154A at Dharwala after spring rain connects Bharmour/Holi region to health infrastructure.",
    "pincode": "176310",
    "email": "dr.janak.raj@hpvidhansabha.nic.in"
  },
  {
    "no": 3,
    "constituency": "Chamba",
    "district": "Chamba",
    "mla": "Neeraj Nayar",
    "party": "INC",
    "reports": 2,
    "neglect": 61,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Chamba.",
    "pincode": "176310",
    "email": "neeraj.nayar@hpvidhansabha.nic.in"
  },
  {
    "no": 4,
    "constituency": "Dalhousie",
    "district": "Chamba",
    "mla": "D S Thakur",
    "party": "BJP",
    "reports": 2,
    "neglect": 61,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Dalhousie.",
    "pincode": "176310",
    "email": "d.s.thakur@hpvidhansabha.nic.in"
  },
  {
    "no": 5,
    "constituency": "Bhattiyat",
    "district": "Chamba",
    "mla": "Kuldeep Singh Pathania",
    "party": "INC",
    "reports": 2,
    "neglect": 61,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Bhattiyat.",
    "pincode": "176310",
    "email": "kuldeep.singh.pathania@hpvidhansabha.nic.in"
  },
  {
    "no": 6,
    "constituency": "Nurpur",
    "district": "Kangra",
    "mla": "Ranveer Singh",
    "party": "BJP",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Nurpur.",
    "pincode": "176215",
    "email": "ranveer.singh@hpvidhansabha.nic.in"
  },
  {
    "no": 7,
    "constituency": "Indora (SC)",
    "district": "Kangra",
    "mla": "Malender Rajan",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Indora (SC).",
    "pincode": "176215",
    "email": "malender.rajan@hpvidhansabha.nic.in"
  },
  {
    "no": 8,
    "constituency": "Fatehpur",
    "district": "Kangra",
    "mla": "Bhawani Singh Pathania",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Fatehpur.",
    "pincode": "176215",
    "email": "bhawani.singh.pathania@hpvidhansabha.nic.in"
  },
  {
    "no": 9,
    "constituency": "Jawali",
    "district": "Kangra",
    "mla": "Chander Kumar",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Jawali.",
    "pincode": "176215",
    "email": "chander.kumar@hpvidhansabha.nic.in"
  },
  {
    "no": 10,
    "constituency": "Dehra",
    "district": "Kangra",
    "mla": "Kamlesh Thakur",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Dehra.",
    "pincode": "176215",
    "email": "kamlesh.thakur@hpvidhansabha.nic.in"
  },
  {
    "no": 11,
    "constituency": "Jaswan-Pragpur",
    "district": "Kangra",
    "mla": "Bikram Thakur",
    "party": "BJP",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Jaswan-Pragpur.",
    "pincode": "176215",
    "email": "bikram.thakur@hpvidhansabha.nic.in"
  },
  {
    "no": 12,
    "constituency": "Jawalamukhi",
    "district": "Kangra",
    "mla": "Sanjay Rattan",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Jawalamukhi.",
    "pincode": "176215",
    "email": "sanjay.rattan@hpvidhansabha.nic.in"
  },
  {
    "no": 13,
    "constituency": "Jaisinghpur (SC)",
    "district": "Kangra",
    "mla": "Yadvinder Goma",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Jaisinghpur (SC).",
    "pincode": "176215",
    "email": "yadvinder.goma@hpvidhansabha.nic.in"
  },
  {
    "no": 14,
    "constituency": "Sullah",
    "district": "Kangra",
    "mla": "Vipin Singh Parmar",
    "party": "BJP",
    "reports": 1,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "No meaningful engagement from MLA's office on revenue-record failures or blocked Panchayat roads.",
    "pincode": "176215",
    "email": "vipin.singh.parmar@hpvidhansabha.nic.in"
  },
  {
    "no": 15,
    "constituency": "Nagrota",
    "district": "Kangra",
    "mla": "Raghubir Singh Bali",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Nagrota.",
    "pincode": "176215",
    "email": "raghubir.singh.bali@hpvidhansabha.nic.in"
  },
  {
    "no": 16,
    "constituency": "Kangra",
    "district": "Kangra",
    "mla": "Pawan Kumar Kajal",
    "party": "BJP",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Kangra.",
    "pincode": "176215",
    "email": "pawan.kumar.kajal@hpvidhansabha.nic.in"
  },
  {
    "no": 17,
    "constituency": "Shahpur",
    "district": "Kangra",
    "mla": "Kewal Singh Pathania",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Shahpur.",
    "pincode": "176215",
    "email": "kewal.singh.pathania@hpvidhansabha.nic.in"
  },
  {
    "no": 18,
    "constituency": "Dharamshala",
    "district": "Kangra",
    "mla": "Sudhir Sharma",
    "party": "BJP",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Dharamshala.",
    "pincode": "176215",
    "email": "sudhir.sharma@hpvidhansabha.nic.in"
  },
  {
    "no": 19,
    "constituency": "Palampur",
    "district": "Kangra",
    "mla": "Ashish Butail",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Palampur.",
    "pincode": "176215",
    "email": "ashish.butail@hpvidhansabha.nic.in"
  },
  {
    "no": 20,
    "constituency": "Baijnath (SC)",
    "district": "Kangra",
    "mla": "Kishori Lal",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Baijnath (SC).",
    "pincode": "176215",
    "email": "kishori.lal@hpvidhansabha.nic.in"
  },
  {
    "no": 21,
    "constituency": "Lahaul and Spiti (ST)",
    "district": "Lahaul & Spiti",
    "mla": "Anuradha Rana",
    "party": "INC",
    "reports": 2,
    "neglect": 50,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Lahaul and Spiti (ST).",
    "pincode": "175132",
    "email": "anuradha.rana@hpvidhansabha.nic.in"
  },
  {
    "no": 22,
    "constituency": "Manali",
    "district": "Kullu",
    "mla": "Bhuvneshwar Gaur",
    "party": "INC",
    "reports": 2,
    "neglect": 58,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Manali.",
    "pincode": "175101",
    "email": "bhuvneshwar.gaur@hpvidhansabha.nic.in"
  },
  {
    "no": 23,
    "constituency": "Kullu",
    "district": "Kullu",
    "mla": "Sunder Singh Thakur",
    "party": "INC",
    "reports": 2,
    "neglect": 58,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Kullu.",
    "pincode": "175101",
    "email": "sunder.singh.thakur@hpvidhansabha.nic.in"
  },
  {
    "no": 24,
    "constituency": "Banjar",
    "district": "Kullu",
    "mla": "Surender Shourie",
    "party": "BJP",
    "reports": 2,
    "neglect": 58,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Banjar.",
    "pincode": "175101",
    "email": "surender.shourie@hpvidhansabha.nic.in"
  },
  {
    "no": 25,
    "constituency": "Anni (SC)",
    "district": "Kullu",
    "mla": "Lokendra Kumar",
    "party": "BJP",
    "reports": 2,
    "neglect": 58,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Anni (SC).",
    "pincode": "175101",
    "email": "lokendra.kumar@hpvidhansabha.nic.in"
  },
  {
    "no": 26,
    "constituency": "Karsog (SC)",
    "district": "Mandi",
    "mla": "Deepraj Kapoor",
    "party": "BJP",
    "reports": 2,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Karsog (SC).",
    "pincode": "175001",
    "email": "deepraj.kapoor@hpvidhansabha.nic.in"
  },
  {
    "no": 27,
    "constituency": "Sundernagar",
    "district": "Mandi",
    "mla": "Rakesh Jamwal",
    "party": "BJP",
    "reports": 2,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Sundernagar.",
    "pincode": "175001",
    "email": "rakesh.jamwal@hpvidhansabha.nic.in"
  },
  {
    "no": 28,
    "constituency": "Nachan (SC)",
    "district": "Mandi",
    "mla": "Vinod Kumar",
    "party": "BJP",
    "reports": 2,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Nachan (SC).",
    "pincode": "175001",
    "email": "vinod.kumar@hpvidhansabha.nic.in"
  },
  {
    "no": 29,
    "constituency": "Seraj",
    "district": "Mandi",
    "mla": "Jai Ram Thakur",
    "party": "BJP",
    "reports": 2,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Seraj.",
    "pincode": "175001",
    "email": "jai.ram.thakur@hpvidhansabha.nic.in"
  },
  {
    "no": 30,
    "constituency": "Darang",
    "district": "Mandi",
    "mla": "Puranchand Thakur",
    "party": "BJP",
    "reports": 2,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Darang.",
    "pincode": "175001",
    "email": "puranchand.thakur@hpvidhansabha.nic.in"
  },
  {
    "no": 31,
    "constituency": "Jogindernagar",
    "district": "Mandi",
    "mla": "Prakash Rana",
    "party": "BJP",
    "reports": 2,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Jogindernagar.",
    "pincode": "175001",
    "email": "prakash.rana@hpvidhansabha.nic.in"
  },
  {
    "no": 32,
    "constituency": "Dharampur",
    "district": "Mandi",
    "mla": "Chandershekhar",
    "party": "INC",
    "reports": 2,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Dharampur.",
    "pincode": "175001",
    "email": "chandershekhar@hpvidhansabha.nic.in"
  },
  {
    "no": 33,
    "constituency": "Mandi",
    "district": "Mandi",
    "mla": "Anil Sharma",
    "party": "BJP",
    "reports": 2,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Mandi.",
    "pincode": "175001",
    "email": "anil.sharma@hpvidhansabha.nic.in"
  },
  {
    "no": 34,
    "constituency": "Balh (SC)",
    "district": "Mandi",
    "mla": "Inder Singh Gandhi",
    "party": "BJP",
    "reports": 1,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Sarkaghat/Bhangrotu roads unrepaired since 2023 monsoon floods.",
    "pincode": "175001",
    "email": "inder.singh.gandhi@hpvidhansabha.nic.in"
  },
  {
    "no": 35,
    "constituency": "Sarkaghat",
    "district": "Mandi",
    "mla": "Dalip Thakur",
    "party": "BJP",
    "reports": 2,
    "neglect": 65,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Sarkaghat.",
    "pincode": "175001",
    "email": "dalip.thakur@hpvidhansabha.nic.in"
  },
  {
    "no": 36,
    "constituency": "Bhoranj (SC)",
    "district": "Hamirpur",
    "mla": "Suresh Kumar",
    "party": "INC",
    "reports": 2,
    "neglect": 63,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Bhoranj (SC).",
    "pincode": "177001",
    "email": "suresh.kumar@hpvidhansabha.nic.in"
  },
  {
    "no": 37,
    "constituency": "Sujanpur",
    "district": "Hamirpur",
    "mla": "Ranjit Singh",
    "party": "INC",
    "reports": 2,
    "neglect": 63,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Sujanpur.",
    "pincode": "177001",
    "email": "ranjit.singh@hpvidhansabha.nic.in"
  },
  {
    "no": 38,
    "constituency": "Hamirpur",
    "district": "Hamirpur",
    "mla": "Ashish Sharma",
    "party": "BJP",
    "reports": 2,
    "neglect": 63,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Hamirpur.",
    "pincode": "177001",
    "email": "ashish.sharma@hpvidhansabha.nic.in"
  },
  {
    "no": 39,
    "constituency": "Barsar",
    "district": "Hamirpur",
    "mla": "Inder Dutt Lakhanpal",
    "party": "BJP",
    "reports": 2,
    "neglect": 63,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Barsar.",
    "pincode": "177001",
    "email": "inder.dutt.lakhanpal@hpvidhansabha.nic.in"
  },
  {
    "no": 40,
    "constituency": "Nadaun",
    "district": "Hamirpur",
    "mla": "Sukhvinder Singh Sukhu",
    "party": "INC",
    "reports": 1,
    "neglect": 63,
    "dominantIssue": "Roads",
    "problem": "Delayed and stalled PWD road from Majhin Chowk to Majhin.",
    "pincode": "177001",
    "email": "sukhvinder.singh.sukhu@hpvidhansabha.nic.in"
  },
  {
    "no": 41,
    "constituency": "Chintpurni (SC)",
    "district": "Una",
    "mla": "Sudarshan Singh Babloo",
    "party": "INC",
    "reports": 2,
    "neglect": 74,
    "dominantIssue": "Health",
    "problem": "Recurring health maintenance delays and administrative pendency in Chintpurni (SC).",
    "pincode": "174303",
    "email": "sudarshan.singh.babloo@hpvidhansabha.nic.in"
  },
  {
    "no": 42,
    "constituency": "Gagret",
    "district": "Una",
    "mla": "Chaitanya Sharma",
    "party": "INC",
    "reports": 1,
    "neglect": 74,
    "dominantIssue": "Health",
    "problem": "Gagret Civil Hospital work on hold for 5-7 years despite construction due to land feuds.",
    "pincode": "174303",
    "email": "chaitanya.sharma@hpvidhansabha.nic.in"
  },
  {
    "no": 43,
    "constituency": "Haroli",
    "district": "Una",
    "mla": "Mukesh Agnihotri",
    "party": "INC",
    "reports": 1,
    "neglect": 74,
    "dominantIssue": "Health",
    "problem": "Complete lack of footpaths, sidewalks, and dustbins in public market area.",
    "pincode": "174303",
    "email": "mukesh.agnihotri@hpvidhansabha.nic.in"
  },
  {
    "no": 44,
    "constituency": "Una",
    "district": "Una",
    "mla": "Satpal Singh Satti",
    "party": "BJP",
    "reports": 2,
    "neglect": 74,
    "dominantIssue": "Health",
    "problem": "Recurring health maintenance delays and administrative pendency in Una.",
    "pincode": "174303",
    "email": "satpal.singh.satti@hpvidhansabha.nic.in"
  },
  {
    "no": 45,
    "constituency": "Kutlehar",
    "district": "Una",
    "mla": "Davinder Kumar",
    "party": "INC",
    "reports": 2,
    "neglect": 74,
    "dominantIssue": "Health",
    "problem": "Recurring health maintenance delays and administrative pendency in Kutlehar.",
    "pincode": "174303",
    "email": "davinder.kumar@hpvidhansabha.nic.in"
  },
  {
    "no": 46,
    "constituency": "Jhanduta (SC)",
    "district": "Bilaspur",
    "mla": "Jeet Ram Katwal",
    "party": "BJP",
    "reports": 2,
    "neglect": 67,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Jhanduta (SC).",
    "pincode": "174001",
    "email": "jeet.ram.katwal@hpvidhansabha.nic.in"
  },
  {
    "no": 47,
    "constituency": "Ghumarwin",
    "district": "Bilaspur",
    "mla": "Rajesh Dharmani",
    "party": "INC",
    "reports": 2,
    "neglect": 67,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Ghumarwin.",
    "pincode": "174001",
    "email": "rajesh.dharmani@hpvidhansabha.nic.in"
  },
  {
    "no": 48,
    "constituency": "Bilaspur",
    "district": "Bilaspur",
    "mla": "Trilok Jamwal",
    "party": "BJP",
    "reports": 2,
    "neglect": 67,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Bilaspur.",
    "pincode": "174001",
    "email": "trilok.jamwal@hpvidhansabha.nic.in"
  },
  {
    "no": 49,
    "constituency": "Sri Naina Deviji",
    "district": "Bilaspur",
    "mla": "Randhir Sharma",
    "party": "BJP",
    "reports": 2,
    "neglect": 67,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Sri Naina Deviji.",
    "pincode": "174001",
    "email": "randhir.sharma@hpvidhansabha.nic.in"
  },
  {
    "no": 50,
    "constituency": "Arki",
    "district": "Solan",
    "mla": "Sanjay Awasthy",
    "party": "INC",
    "reports": 2,
    "neglect": 71,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Arki.",
    "pincode": "173212",
    "email": "sanjay.awasthy@hpvidhansabha.nic.in"
  },
  {
    "no": 51,
    "constituency": "Nalagarh",
    "district": "Solan",
    "mla": "Hardeep Singh Bawa",
    "party": "INC",
    "reports": 2,
    "neglect": 71,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Nalagarh.",
    "pincode": "173212",
    "email": "hardeep.singh.bawa@hpvidhansabha.nic.in"
  },
  {
    "no": 52,
    "constituency": "Doon",
    "district": "Solan",
    "mla": "Ram Kumar Chaudhary",
    "party": "INC",
    "reports": 2,
    "neglect": 71,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Doon.",
    "pincode": "173212",
    "email": "ram.kumar.chaudhary@hpvidhansabha.nic.in"
  },
  {
    "no": 53,
    "constituency": "Solan (SC)",
    "district": "Solan",
    "mla": "Dhani Ram Shandil",
    "party": "INC",
    "reports": 2,
    "neglect": 71,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Solan (SC).",
    "pincode": "173212",
    "email": "dhani.ram.shandil@hpvidhansabha.nic.in"
  },
  {
    "no": 54,
    "constituency": "Kasauli (SC)",
    "district": "Solan",
    "mla": "Vinod Sultanpuri",
    "party": "INC",
    "reports": 1,
    "neglect": 71,
    "dominantIssue": "Roads",
    "problem": "Encroachments on pavements make walking impossible. Cyclic path/village connectivity blocked.",
    "pincode": "173212",
    "email": "vinod.sultanpuri@hpvidhansabha.nic.in"
  },
  {
    "no": 55,
    "constituency": "Pachhad (SC)",
    "district": "Sirmaur",
    "mla": "Reena Kashyap",
    "party": "BJP",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Health",
    "problem": "Recurring health maintenance delays and administrative pendency in Pachhad (SC).",
    "pincode": "173001",
    "email": "reena.kashyap@hpvidhansabha.nic.in"
  },
  {
    "no": 56,
    "constituency": "Nahan",
    "district": "Sirmaur",
    "mla": "Ajay Solanki",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Health",
    "problem": "Recurring health maintenance delays and administrative pendency in Nahan.",
    "pincode": "173001",
    "email": "ajay.solanki@hpvidhansabha.nic.in"
  },
  {
    "no": 57,
    "constituency": "Sri Renukaji (SC)",
    "district": "Sirmaur",
    "mla": "Vinay Kumar",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Health",
    "problem": "Recurring health maintenance delays and administrative pendency in Sri Renukaji (SC).",
    "pincode": "173001",
    "email": "vinay.kumar@hpvidhansabha.nic.in"
  },
  {
    "no": 58,
    "constituency": "Paonta Sahib",
    "district": "Sirmaur",
    "mla": "Sukh Ram Chaudhary",
    "party": "BJP",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Health",
    "problem": "Recurring health maintenance delays and administrative pendency in Paonta Sahib.",
    "pincode": "173001",
    "email": "sukh.ram.chaudhary@hpvidhansabha.nic.in"
  },
  {
    "no": 59,
    "constituency": "Shillai",
    "district": "Sirmaur",
    "mla": "Harshwardhan Chauhan",
    "party": "INC",
    "reports": 2,
    "neglect": 69,
    "dominantIssue": "Health",
    "problem": "Recurring health maintenance delays and administrative pendency in Shillai.",
    "pincode": "173001",
    "email": "harshwardhan.chauhan@hpvidhansabha.nic.in"
  },
  {
    "no": 60,
    "constituency": "Chopal",
    "district": "Shimla",
    "mla": "Balbir Singh Verma",
    "party": "BJP",
    "reports": 2,
    "neglect": 73,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Chopal.",
    "pincode": "171001",
    "email": "balbir.singh.verma@hpvidhansabha.nic.in"
  },
  {
    "no": 61,
    "constituency": "Theog",
    "district": "Shimla",
    "mla": "Kuldeep Singh Rathore",
    "party": "INC",
    "reports": 2,
    "neglect": 73,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Theog.",
    "pincode": "171001",
    "email": "kuldeep.singh.rathore@hpvidhansabha.nic.in"
  },
  {
    "no": 62,
    "constituency": "Kasumpti",
    "district": "Shimla",
    "mla": "Anirudh Singh",
    "party": "INC",
    "reports": 2,
    "neglect": 73,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Kasumpti.",
    "pincode": "171001",
    "email": "anirudh.singh@hpvidhansabha.nic.in"
  },
  {
    "no": 63,
    "constituency": "Shimla",
    "district": "Shimla",
    "mla": "Harish Janartha",
    "party": "INC",
    "reports": 1,
    "neglect": 73,
    "dominantIssue": "Roads",
    "problem": "Token system broken at IGMC Eye OPD. Staff and department head unresponsive to citizen complaints.",
    "pincode": "171001",
    "email": "harish.janartha@hpvidhansabha.nic.in"
  },
  {
    "no": 64,
    "constituency": "Shimla Rural",
    "district": "Shimla",
    "mla": "Vikramaditya Singh",
    "party": "INC",
    "reports": 2,
    "neglect": 73,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Shimla Rural.",
    "pincode": "171001",
    "email": "vikramaditya.singh@hpvidhansabha.nic.in"
  },
  {
    "no": 65,
    "constituency": "Jubbal-Kotkhai",
    "district": "Shimla",
    "mla": "Rohit Thakur",
    "party": "INC",
    "reports": 2,
    "neglect": 73,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Jubbal-Kotkhai.",
    "pincode": "171001",
    "email": "rohit.thakur@hpvidhansabha.nic.in"
  },
  {
    "no": 66,
    "constituency": "Rampur (SC)",
    "district": "Shimla",
    "mla": "Nand Lal",
    "party": "INC",
    "reports": 2,
    "neglect": 73,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Rampur (SC).",
    "pincode": "171001",
    "email": "nand.lal@hpvidhansabha.nic.in"
  },
  {
    "no": 67,
    "constituency": "Rohru (SC)",
    "district": "Shimla",
    "mla": "Mohan Lal Brakta",
    "party": "INC",
    "reports": 2,
    "neglect": 73,
    "dominantIssue": "Roads",
    "problem": "Recurring roads maintenance delays and administrative pendency in Rohru (SC).",
    "pincode": "171001",
    "email": "mohan.lal.brakta@hpvidhansabha.nic.in"
  },
  {
    "no": 68,
    "constituency": "Kinnaur (ST)",
    "district": "Kinnaur",
    "mla": "Jagat Singh Negi",
    "party": "INC",
    "reports": 2,
    "neglect": 55,
    "dominantIssue": "Power",
    "problem": "Recurring power maintenance delays and administrative pendency in Kinnaur (ST).",
    "pincode": "172107",
    "email": "jagat.singh.negi@hpvidhansabha.nic.in"
  }
];

const HAP_CIVIC_HELPERS = {
  // Format WhatsApp message for MLA
  getWhatsAppMLALink: function(mla) {
    const text = 'Jai Hind ' + mla.mla + ' ji,\n\n' +
      'As a constituent of ' + mla.constituency + ' (' + mla.district + ' district), I am writing regarding unaddressed civic issues on the Himachal Accountability Project public ledger.\n\n' +
      '📊 Constituency Grievance Status:\n' +
      '• Unresolved Rate: ' + mla.neglect + '%\n' +
      '• Verified Field Reports: ' + mla.reports + '\n' +
      '• Primary Issue: ' + mla.dominantIssue + '\n' +
      '• Summary: ' + mla.problem + '\n\n' +
      'Kindly review this public record and coordinate with the administrative departments for prompt redressal.\n\n' +
      'Ledger details: https://himachalaccountability.org/mlas.html?no=' + mla.no + '\n\n' +
      '— Citizen of Himachal Pradesh (himachalaccountability.org)';
    return 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
  },

  // Format Email for MLA
  getEmailMLALink: function(mla) {
    const subject = encodeURIComponent('Civic Grievances & Unresolved Rate: ' + mla.constituency + ' — Himachal Accountability Project');
    const body = encodeURIComponent(
      'Respected ' + mla.mla + ' ji,\n\n' +
      'I am writing to your office as a resident of ' + mla.constituency + ' in ' + mla.district + ' district.\n\n' +
      'According to the independent public ledger maintained by the Himachal Accountability Project (HAP):\n' +
      '- Constituency Unresolved Rate: ' + mla.neglect + '%\n' +
      '- Primary Neglected Sector: ' + mla.dominantIssue + '\n' +
      '- Verified Public Report: ' + mla.problem + '\n\n' +
      'We request your urgent intervention with the concerned district administration and department engineers.\n\n' +
      'Full public ledger: https://himachalaccountability.org/mlas.html?no=' + mla.no + '\n\n' +
      'Thank you,\n' +
      'Citizen of Himachal Pradesh'
    );
    return 'mailto:' + mla.email + '?subject=' + subject + '&body=' + body;
  },

  // Format WhatsApp message for District Comparison
  getWhatsAppCompareLink: function(d1Name, d2Name) {
    const d1 = HAP_DISTRICTS[d1Name] || {};
    const d2 = HAP_DISTRICTS[d2Name] || {};
    if (!d1.score || !d2.score) return 'https://api.whatsapp.com/send?text=';

    const diff = Math.abs(d1.score - d2.score).toFixed(1);
    const leader = d1.score >= d2.score ? d1Name : d2Name;

    const text = '⚖️ District Accountability Comparison: ' + d1Name + ' vs ' + d2Name + '\n\n' +
      '🏆 ' + d1Name + ' (Rank #' + d1.rank + '):\n' +
      '• Score: ' + d1.score + ' / 100 (' + d1.tier + ')\n' +
      '• Unresolved Rate: ' + d1.neglect + '% (' + d1.count + ' reports)\n' +
      '• Top Concern: ' + d1.top + '\n\n' +
      '🏆 ' + d2Name + ' (Rank #' + d2.rank + '):\n' +
      '• Score: ' + d2.score + ' / 100 (' + d2.tier + ')\n' +
      '• Unresolved Rate: ' + d2.neglect + '% (' + d2.count + ' reports)\n' +
      '• Top Concern: ' + d2.top + '\n\n' +
      '📊 Result: ' + leader + ' leads by +' + diff + ' points in administrative responsiveness.\n\n' +
      'Read full 5-pillar breakdown: https://himachalaccountability.org/compare.html?d1=' + encodeURIComponent(d1Name) + '&d2=' + encodeURIComponent(d2Name) + '\n\n' +
      '— Himachal Accountability Project';
    return 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text);
  },

  // Export full civic data to CSV
  exportCivicCSV: function() {
    let csv = 'HIMACHAL ACCOUNTABILITY PROJECT — OPEN CIVIC DATASET\n';
    csv += 'Source: himachalaccountability.org | License: Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)\n';
    csv += 'Export Date: ' + new Date().toISOString() + '\n\n';

    csv += 'DISTRICT_ACCOUNTABILITY_SCORES\n';
    csv += 'Rank,District,Score,Status_Tier,Unresolved_Rate_Pct,Reports_Count,Top_Grievance,Roads_Pillar,Water_Pillar,Health_Pillar,Power_Pillar,Youth_Pillar,Total_Seats,INC_Seats,BJP_Seats\n';
    
    const sortedDists = Object.entries(HAP_DISTRICTS).sort((a,b) => a[1].rank - b[1].rank);
    for (const [name, d] of sortedDists) {
      const totalSeats = (d.incSeats || 0) + (d.bjpSeats || 0);
      csv += [
        d.rank,
        '"' + name + '"',
        d.score,
        '"' + d.tier + '"',
        d.neglect,
        d.count,
        '"' + d.top + '"',
        d.pwd,
        d.water,
        d.health,
        d.power,
        d.youth,
        totalSeats,
        d.incSeats,
        d.bjpSeats
      ].join(',') + '\n';
    }

    csv += '\nASSEMBLY_CONSTITUENCIES_AND_MLAS\n';
    csv += 'Seat_No,Constituency,District,MLA_Name,Party,Grievance_Reports,Unresolved_Rate_Pct,Dominant_Sector,Problem_Summary,Pincode,Official_Email\n';
    for (const m of HAP_MLAS) {
      csv += [
        m.no,
        '"' + m.constituency + '"',
        '"' + m.district + '"',
        '"' + m.mla + '"',
        '"' + m.party + '"',
        m.reports,
        m.neglect,
        '"' + m.dominantIssue + '"',
        '"' + m.problem.replace(/"/g, '""') + '"',
        m.pincode,
        m.email
      ].join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'himachal_accountability_dataset_' + new Date().toISOString().slice(0,10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
