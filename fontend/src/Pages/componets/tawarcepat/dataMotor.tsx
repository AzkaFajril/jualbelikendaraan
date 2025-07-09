export interface VarianMotor {
  nama: string;
}

export interface ModelMotor {
  nama: string;
  varian: VarianMotor[];
}

export interface MerkMotor {
  nama: string;
  logo?: string;
  model: ModelMotor[];
}

export const dataMotor: MerkMotor[] = [
  {
    nama: 'Yamaha',
    logo: 'https://img.icons8.com/color/48/000000/yamaha.png',
    model: [
      {
        nama: 'NMAX',
        varian: [
          { nama: 'NMAX 155 Connected' },
          { nama: 'NMAX 155 Non-ABS' },
        ],
      },
      {
        nama: 'Aerox',
        varian: [
          { nama: 'Aerox 155 Connected' },
          { nama: 'Aerox 155 S-Version' },
        ],
      },
    ],
  },
  {
    nama: 'Honda',
    logo: 'https://img.icons8.com/color/48/000000/honda.png',
    model: [
      {
        nama: 'BeAT',
        varian: [
          { nama: 'BeAT CBS' },
          { nama: 'BeAT Deluxe' },
        ],
      },
      {
        nama: 'Vario',
        varian: [
          { nama: 'Vario 125' },
          { nama: 'Vario 160' },
        ],
      },
    ],
  },
  {
    nama: 'Suzuki',
    logo: 'https://img.icons8.com/color/48/000000/suzuki.png',
    model: [
      {
        nama: 'Satria',
        varian: [
          { nama: 'Satria F150' },
        ],
      },
      {
        nama: 'Nex',
        varian: [
          { nama: 'Nex II' },
        ],
      },
    ],
  },
  {
    nama: 'Kawasaki',
    logo: 'https://img.icons8.com/color/48/000000/kawasaki.png',
    model: [
      {
        nama: 'Ninja',
        varian: [
          { nama: 'Ninja 250' },
          { nama: 'Ninja ZX-25R' },
        ],
      },
      {
        nama: 'W175',
        varian: [
          { nama: 'W175 SE' },
        ],
      },
    ],
  },
]; 