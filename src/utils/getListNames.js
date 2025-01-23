import TEAMS from "@/constants/teamMapping";

export default function getListNames(selectedKey) {
    // Cari objek berdasarkan key yang dipilih
    const selectedTeam = TEAMS.find(team => team[selectedKey]);
    
    // Kembalikan value dalam bentuk list, atau array kosong jika key tidak ditemukan
    return selectedTeam ? Object.keys(selectedTeam[selectedKey]) : [];
  }