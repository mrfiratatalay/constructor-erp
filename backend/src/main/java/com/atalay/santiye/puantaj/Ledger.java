package com.atalay.santiye.puantaj;

import java.util.List;

/**
 * Bir tarih aralığının puantajı: görünen kalemler (önce kişiler sonra ekipler, ada göre), işaretlenmiş günler ve
 * adları çözmek için firmanın kişileri. Bugünün ekranı, ayın cetveli ve Excel aynı defteri okur.
 */
record Ledger(List<RosterEntry> entries, List<DayMark> marks, RosterPeople people) {
}
