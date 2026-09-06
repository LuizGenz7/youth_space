export const ZAMBIA_LOCATIONS = [
  {
    province: "Central",
    districts: [
      "Chibombo",
      "Chisamba",
      "Chitambo",
      "Kabwe",
      "Kapiri Mposhi",
      "Luano",
      "Mkushi",
      "Mumbwa",
      "Ngabwe",
      "Serenje",
      "Shibuyunji",
    ],
  },

  {
    province: "Copperbelt",
    districts: [
      "Chambishi",
      "Chililabombwe",
      "Chingola",
      "Kalulushi",
      "Kitwe",
      "Lufwanyama",
      "Luanshya",
      "Masaiti",
      "Mpongwe",
      "Mufulira",
      "Ndola",
    ],
  },

  {
    province: "Eastern",
    districts: [
      "Chadiza",
      "Chama",
      "Chipata",
      "Katete",
      "Lumezi",
      "Lundazi",
      "Mambwe",
      "Nyimba",
      "Petauke",
      "Sinda",
      "Vubwi",
    ],
  },

  {
    province: "Luapula",
    districts: [
      "Chembe",
      "Chiengi",
      "Chifunabuli",
      "Chipili",
      "Kawambwa",
      "Lunga",
      "Mansa",
      "Milenge",
      "Mwansabombwe",
      "Mwense",
      "Nchelenge",
      "Samfya",
    ],
  },

  {
    province: "Lusaka",
    districts: [
      "Chongwe",
      "Kafue",
      "Luangwa",
      "Lusaka",
      "Rufunsa",
    ],
  },

  {
    province: "Muchinga",
    districts: [
      "Chinsali",
      "Isoka",
      "Kanchibiya",
      "Lavushimanda",
      "Mafinga",
      "Mpika",
      "Nakonde",
      "Shiwang'andu",
    ],
  },

  {
    province: "Northern",
    districts: [
      "Chilubi",
      "Kaputa",
      "Kasama",
      "Lunte",
      "Lupososhi",
      "Luwingu",
      "Mbala",
      "Mporokoso",
      "Mpulungu",
      "Mungwi",
      "Nsama",
    ],
  },

  {
    province: "North-Western",
    districts: [
      "Chavuma",
      "Ikelenge",
      "Kabompo",
      "Kalumbila",
      "Kasempa",
      "Manyinga",
      "Mufumbwe",
      "Mushindamo",
      "Mwinilunga",
      "Solwezi",
      "Zambezi",
    ],
  },

  {
    province: "Southern",
    districts: [
      "Chikankata",
      "Chirundu",
      "Choma",
      "Gwembe",
      "Itezhi-Tezhi",
      "Kalomo",
      "Kazungula",
      "Livingstone",
      "Mazabuka",
      "Monze",
      "Namwala",
      "Pemba",
      "Siavonga",
      "Sinazongwe",
      "Zimba",
    ],
  },

  {
    province: "Western",
    districts: [
      "Kalabo",
      "Kaoma",
      "Limulunga",
      "Lukulu",
      "Mongu",
      "Mulobezi",
      "Mwandi",
      "Nalolo",
      "Nkeyema",
      "Senanga",
      "Sesheke",
      "Shang'ombo",
      "Sikongo",
      "Sioma",
    ],
  },
];

export const ZAMBIA_PROVINCES =
  ZAMBIA_LOCATIONS.map(
    ({ province }) => province,
  );

export function getDistrictsByProvince(
  province,
) {
  return (
    ZAMBIA_LOCATIONS.find(
      (item) => item.province === province,
    )?.districts || []
  );
}