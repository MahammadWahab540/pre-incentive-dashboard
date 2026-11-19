export interface Employee {
  id: string;
  name: string;
  email: string;
  adjustment: number | null; // null for NA
}

export const EMPLOYEES: Employee[] = [
  { id: 'jinsha-p', name: 'Jinsha P', email: 'jinsha.p@nxtwave.co.in', adjustment: 20 },
  { id: 'siddhi-sontakke', name: 'Siddhi Sontakke', email: 'siddhi.sontakke@nxtwave.co.in', adjustment: null },
  { id: 'afsalsyed-mohammed', name: 'Afsal Syed Mohammed', email: 'afsalsyed.mohammed@nxtwave.co.in', adjustment: null },
  { id: 'bavethra-t', name: 'Bavethra T', email: 'bavethra.t@nxtwave.co.in', adjustment: 10 },
  { id: 'phaniraju-pushkara', name: 'Phaniraju Pushkara', email: 'phaniraju.pushkara@nxtwave.co.in', adjustment: null },
  { id: 'pavitran-naik', name: 'Pavitran Naik', email: 'pavitran.naik@nxtwave.co.in', adjustment: 10 },
  { id: 'vishwareth-golla', name: 'Vishwareth Golla', email: 'vishwareth.golla@nxtwave.co.in', adjustment: 10 },
  { id: 'shilpa-dharwadakar', name: 'Shilpa Dharwadakar', email: 'shilpa.dharwadakar@nxtwave.co.in', adjustment: 20 },
  { id: 'gowthamreddy-karri', name: 'Gowthamreddy Karri', email: 'gowthamreddy.karri@nxtwave.co.in', adjustment: 10 },
  { id: 'moolinti-suneetha', name: 'Moolinti Suneetha', email: 'moolinti.suneetha@nxtwave.co.in', adjustment: 10 },
  { id: 'biswajit-panda', name: 'Biswajit Panda', email: 'biswajit.panda@nxtwave.co.in', adjustment: 10 },
  { id: 'afreen-shaik', name: 'Afreen Shaik', email: 'afreen.shaik@nxtwave.co.in', adjustment: 10 },
  { id: 'bandla-suvarna', name: 'Bandla Suvarna', email: 'bandla.suvarna@nxtwave.co.in', adjustment: 20 },
  { id: 'sejal-dilipkamble', name: 'Sejal Dilipkamble', email: 'sejal.dilipkamble@nxtwave.co.in', adjustment: 30 },
  { id: 'kiran-kumarmanaji', name: 'Kiran Kumarmanaji', email: 'kiran.kumarmanaji@nxtwave.co.in', adjustment: 20 },
  { id: 'priyanka-dilipraopakhale', name: 'Priyanka Dilipraopakhale', email: 'priyanka.dilipraopakhale@nxtwave.co.in', adjustment: 20 },
  { id: 'mudhabthuni-gayathri', name: 'Mudhabthuni Gayathri', email: 'mudhabthuni.gayathri@nxtwave.co.in', adjustment: 30 },
  { id: 'ruchi-gautam', name: 'Ruchi Gautam', email: 'ruchi.gautam@nxtwave.co.in', adjustment: 30 },
  { id: 'abdul-rasheed', name: 'Abdul Rasheed', email: 'abdul.rasheed@nxtwave.co.in', adjustment: 30 },
  { id: 'haritha-r', name: 'Haritha R', email: 'haritha.r@nxtwave.co.in', adjustment: 30 },
  { id: 'naidu-vinaykumar', name: 'Naidu Vinaykumar', email: 'naidu.vinaykumar@nxtwave.co.in', adjustment: 30 },
  { id: 'savitha-devi', name: 'Savitha Devi', email: 'savitha.devi@nxtwave.co.in', adjustment: 30 },
  { id: 'vamsikrishna-chavala', name: 'Vamsikrishna Chavala', email: 'vamsikrishna.chavala@nxtwave.co.in', adjustment: 30 },
  { id: 'athulkumar-s', name: 'Athulkumar S', email: 'athulkumar.s@nxtwave.co.in', adjustment: 30 },
  { id: 'swetha-a', name: 'Swetha A', email: 'swetha.a@nxtwave.co.in', adjustment: 30 },
  { id: 'chandan-b', name: 'Chandan B', email: 'chandan.b@nxtwave.co.in', adjustment: 30 },
  { id: 'kanumuri-saranya', name: 'Kanumuri Saranya', email: 'kanumuri.saranya@nxtwave.co.in', adjustment: 30 },
  { id: 'satyavani-paluri', name: 'Satyavani Paluri', email: 'satyavani.paluri@nxtwave.co.in', adjustment: 30 },
  { id: 'nakkola-shirisha', name: 'Nakkola Shirisha', email: 'nakkola.shirisha@nxtwave.co.in', adjustment: 20 },
  { id: 'damalanka-pushpavathi', name: 'Damalanka Pushpavathi', email: 'damalanka.pushpavathi@nxtwave.co.in', adjustment: 20 },
  { id: 'sekar-manivannan', name: 'Sekar Manivannan', email: 'sekar.manivannan@nxtwave.co.in', adjustment: 30 },
  { id: 'bellapukonda-navyasri', name: 'Bellapukonda Navyasri', email: 'bellapukonda.navyasri@nxtwave.co.in', adjustment: 20 },
  { id: 'vasanth-t', name: 'Vasanth T', email: 'vasanth.t@nxtwave.co.in', adjustment: 30 },
  { id: 'saddala-sumanth', name: 'Saddala Sumanth', email: 'saddala.sumanth@nxtwave.co.in', adjustment: 30 },
  { id: 'monisha-su', name: 'Monisha Su', email: 'monisha.su@nxtwave.co.in', adjustment: 30 },
  { id: 'vedantsubhash-thoke', name: 'Vedantsubhash Thoke', email: 'vedantsubhash.thoke@nxtwave.co.in', adjustment: 30 },
  { id: 'lavanya-n', name: 'Lavanya N', email: 'lavanya.n@nxtwave.co.in', adjustment: 30 },
  { id: 's-harsh', name: 'S Harsh', email: 's.harsh@nxtwave.co.in', adjustment: -10 },
  { id: 'niyas-j', name: 'Niyas J', email: 'niyas.j@nxtwave.co.in', adjustment: -30 },
  { id: 'pratiksha-madhavraopatil', name: 'Pratiksha Madhavraopatil', email: 'pratiksha.madhavraopatil@nxtwave.co.in', adjustment: -30 },
  { id: 'mohamed-ibrahim', name: 'Mohamed Ibrahim', email: 'mohamed.ibrahim@nxtwave.co.in', adjustment: -30 },
  { id: 'muhammed-ashifr', name: 'Muhammed Ashifr', email: 'muhammed.ashifr@nxtwave.co.in', adjustment: -30 },
  { id: 'vishnupriya-krishnan', name: 'Vishnupriya Krishnan', email: 'vishnupriya.krishnan@nxtwave.co.in', adjustment: -30 },
];

export function findEmployee(identifier: string): Employee | undefined {
  const clean = identifier.trim().toLowerCase();
  return EMPLOYEES.find(
    (e) => e.id.toLowerCase() === clean || e.email.toLowerCase() === clean
  );
}
