// @ts-nocheck -- ported 1:1 from rideff_handoff/design/RIDEFF Business Demo.dc.html (see scripts/dc-port/convert.mjs)
'use client';
import React, { Fragment } from 'react';
import { DCLogic, dcStyle, useDC, useSwitchLocale } from '@/lib/dc';
import DEMO_KEYS from '@/i18n/demo-keymap.json';


// Demo data uses the active locale's messages: initData() runs before each render
// of a new locale (see BusinessDemo below). Client-only route, so module state is fine.
let W7, DN, IND;
let $t = k => k;
let $tx = s => s;
let dataLocale = null;
function initData() {
  W7 = [$t("Demo.tUE13"), $t("Demo.wED14"), $t("Demo.tHU15"), $t("Demo.fRI16"), $t("Demo.sAT17"), $t("Demo.sUN18"), $t("Demo.mON19")],
    DN = [$t("Demo.tue13"), $t("Demo.wed14"), $t("Demo.thu15"), $t("Demo.fri16"), $t("Demo.sat17"), $t("Demo.sun18"), $t("Demo.mon19")];
  IND = {
    cafe: {
      n: 'Café',
      ini: 'CL',
      brand: 'Café Linde',
      tier: 'GROWTH',
      city: $t("Demo.rEGENSBURGOLDTOWNKUMPFMUHL"),
      url: 'cafe-linde.de',
      owner: ['S', 'Sabine Linde'],
      lead: ['M', 'Mia Kraus'],
      team: ['T', 'Tom Berger'],
      claim: $t("Demo.breakfastUntil3PmCakesFrom"),
      facts: [$t("Demo.monSun8Am6Pm"), $t("Demo.n2Locations"), $t("Demo.terrace")],
      form: $t("Demo.bookATable"),
      cta: $t("Demo.reserve"),
      slots: [$t("Demo.sat0900"), $t("Demo.sat1130"), $t("Demo.sun1000"), $t("Demo.sun1300")],
      req: $t("Demo.table"),
      legend: [[$t("Demo.oldTown"), '#FF6A00'], ['Kumpfmühl', '#0A0A0A'], [$t("Demo.all"), '#A1A1AA']],
      brief: [$t("Demo.yesterday2140Revenue8Above"), $t("Demo.saturday22CAndSunnyIn"), $t("Demo.invoiceForTheCityFestivalCatering")],
      kpis: [[$t("Demo.revenueYesterday"), '2.140 €', $t("Demo.n8AbovePlan"), '#15803D'], [$t("Demo.costOfGoods"), '29 %', $t("Demo.targetUnder30"), '#52525B'], [$t("Demo.openInvoices"), '2.420 €', $t("Demo.n1OfThemOver30Days"), '#C2410C']],
      days: [[['A', '07:00', $t("Demo.deliverySchmidBakery")], ['C', '15:00', $t("Demo.taxAdviserMsHuber")]], [['B', '09:00', $t("Demo.coffeeRoasterTasting")], ['A', '14:00', $t("Demo.jobInterviewService")]], [['A', '07:00', $t("Demo.milkDelivery")], ['C', '19:00', $t("Demo.teamMeetingBothShops")]], [['B', '10:00', $t("Demo.hygieneInspection")], ['A', '16:00', $t("Demo.birthdayCakeWeber")]], [['C', '08:00–18:00', $t("Demo.terraceOpen3OnService")], ['A', '12:00', $t("Demo.reservation12Ppl")]], [['B', '09:00', $t("Demo.brunchBuffet")]], [['C', '', $t("Demo.kumpfmuhlClosed")], ['A', '08:30', $t("Demo.espressoMachineService")]]],
      liq: '38.400 €',
      liqD: $t("Demo.lowestPoint14200On10"),
      liqC: '#C2410C',
      series: [31, 33, 35, 34, 37, 39, 38.4, 36, 22, 14.2],
      liqRows: [[$t("Demo.businessAccount"), 24600, '#0A0A0A'], [$t("Demo.tillAndSumUp"), 3180, '#71717A'], [$t("Demo.openReceivables"), 2420, '#FF6A00'], [$t("Demo.vATReserve"), 12400, '#FFB27A'], [$t("Demo.espressoMachineLoan"), -4200, '#DC2626']],
      todos: [[$t("Demo.reorderOatMilkForBothShops"), $t("Demo.n14DayUsage9WeekendReservations"), $t("Demo.avoidsEmergencyPurchase")], [$t("Demo.oneMoreServerOnSaturday"), $t("Demo.n22CTerraceWasFull3"), $t("Demo.approx320")], [$t("Demo.remindCityFestivalCatering"), $t("Demo.n1860OpenFor34Days"), '+1.860 €']],
      goals: [[$t("Demo.octoberRevenue52000"), 71, '#0A0A0A', $t("Demo.n36900SoFar"), $t("Demo.onTrack")], [$t("Demo.reserve3MonthsRent"), 58, '#FF6A00', $t("Demo.n8700Of15000"), $t("Demo.march2027")], [$t("Demo.thirdLocation"), 18, '#71717A', $t("Demo.businessPlanInProgress"), '2028']],
      revL: $t("Demo.revenueThisWeek"),
      revSum: '14.620 €',
      rev: [1640, 1880, 1720, 2140, 2460, 2980, 1800],
      costs: [[$t("Demo.staff"), 14800, 15500], [$t("Demo.costOfGoods"), 10700, 11000], [$t("Demo.rentBothShops"), 6200, 6200], [$t("Demo.energy"), 1380, 1300], ['Marketing', 420, 600]],
      invs: [[$t("Demo.cityFestivalCatering"), $t("Demo.n34DaysOverdue"), '1.860 €', 1], [$t("Demo.kronesCompanyBreakfast"), $t("Demo.dueIn6Days"), '380 €', 0], [$t("Demo.sonnenscheinDaycareCakes"), $t("Demo.dueIn12Days"), '180 €', 0]],
      vat: '12.400 €',
      rotaL: $t("Demo.shiftPlanBothLocations"),
      rota: [['Mia', $t("Demo.shiftLead"), [$t("Demo.earlyA"), $t("Demo.earlyA"), $t("Demo.off"), $t("Demo.earlyA"), $t("Demo.lateA"), $t("Demo.off"), $t("Demo.earlyA")]], [$t("Demo.tom"), 'Service', [$t("Demo.lateA"), $t("Demo.off"), $t("Demo.lateA"), $t("Demo.lateA"), $t("Demo.earlyA"), $t("Demo.earlyA"), $t("Demo.off")]], ['Lena', 'Barista', [$t("Demo.earlyB"), $t("Demo.earlyB"), $t("Demo.earlyB"), $t("Demo.off"), $t("Demo.earlyB"), $t("Demo.earlyB"), $t("Demo.off")]], ['Ali', $t("Demo.kitchen"), [$t("Demo.earlyA"), $t("Demo.earlyA"), $t("Demo.earlyA"), $t("Demo.earlyA"), $t("Demo.off"), $t("Demo.off"), $t("Demo.earlyA")]]],
      rotaNote: $t("Demo.saturdayTheTerraceIsShortStaffed"),
      staff: $t("Demo.tom"),
      staffShift: $t("Demo.lateShiftOldTown1200"),
      tasks: [$t("Demo.restockCakeDisplay"), $t("Demo.setUpTerrace"), $t("Demo.countOatMilk"), $t("Demo.setTable12ForWeber")],
      reqL: $t("Demo.reservationsAndRequests"),
      reqs: [[$t("Demo.weberFamily"), $t("Demo.wEBSITE"), $t("Demo.sat120012PeopleBirthday")], ['Krones AG', $t("Demo.eMAIL"), $t("Demo.breakfastFor30Thu25Oct")], [$t("Demo.mrAlbrecht"), $t("Demo.pHONE"), $t("Demo.sun10004People")], [$t("Demo.cityOfRegensburg"), $t("Demo.eMAIL"), $t("Demo.christmasMarketCateringQuoteRequested")]],
      rating: '4,7 ★ · 312',
      reviews: [['Julia M.', '★★★★★', $t("Demo.bestCheesecakeInTownAndThe"), ''], ['Markus T.', '★★★☆☆', $t("Demo.waited25MinutesForCoffeeOn"), $t("Demo.thanksMarkusOnSaturdayTheTerrace")]],
      stockL: $t("Demo.stockAndPurchasing"),
      stock: [[$t("Demo.oatMilk"), $t("Demo.untilThu18L"), '28', '#FF6A00', 1], [$t("Demo.espressoBeans"), $t("Demo.untilMon9Kg"), '62', '#0A0A0A', 0], [$t("Demo.butter"), $t("Demo.untilFri12Kg"), '40', '#FF6A00', 1], [$t("Demo.paperCups03L"), $t("Demo.lasts3Weeks"), '85', '#0A0A0A', 0], [$t("Demo.flourType550"), $t("Demo.untilSat25Kg"), '35', '#FF6A00', 1]],
      sl: [[$t("Demo.raisePrices"), 0, 8, 1, 0, x => '+' + x + ' %', x => x * 0.9 * 1480], [$t("Demo.oneMorePersonOnSaturdays"), 0, 2, 1, 0, x => '+' + x, x => x * (320 - 160) * 4.3], [$t("Demo.openLaterInTheEvening"), 0, 3, 1, 0, x => '+' + x + ' h', x => x * (210 - 95) * 26]],
      profit: 6800,
      ask: [[$t("Demo.isAThirdLocationWorthIt"), $t("Demo.notYetWithCurrentProfitAnd"), $t("Demo.pROFIT12MORESERVESRENT")], [$t("Demo.whichCakeEarnsTheMost"), $t("Demo.cheesecake38Margin41PiecesA"), $t("Demo.sUMUPTILLRECIPECOSTS")], [$t("Demo.whoHasTooManyHoursThis"), $t("Demo.miaIsAt44HoursTom"), $t("Demo.sHIFTPLANWK42")]],
      srcs: [[$t("Demo.tillSumUp"), $t("Demo.liveBothLocations")], [$t("Demo.businessAccountSparkasse"), $t("Demo.cSVDaily")], [$t("Demo.dATEVTaxAdviser"), $t("Demo.monthlyExport")], ['Google Business', $t("Demo.reviewsAndQuestions")], [$t("Demo.shiftPlan"), $t("Demo.managedInRIDEFF")], [$t("Demo.supplierInvoices"), $t("Demo.viaEmailForwarding")]]
    },
    hotel: {
      n: $t("Demo.hotel"),
      ini: 'HS',
      brand: 'Hotel Seeblick',
      tier: 'PRO',
      city: $t("Demo.tEGERNSEE"),
      url: 'seeblick-tegernsee.de',
      owner: ['K', 'Katrin Moser'],
      lead: ['C', 'Can Aydin'],
      team: ['E', 'Elif Demir'],
      claim: $t("Demo.n24RoomsRightOnTheLake"),
      facts: [$t("Demo.n24Rooms"), 'Sauna', $t("Demo.parking")],
      form: $t("Demo.requestARoom"),
      cta: $t("Demo.checkAvailability"),
      slots: [$t("Demo.friSun"), $t("Demo.monWed"), $t("Demo.nextWeek"), $t("Demo.november")],
      req: $t("Demo.room"),
      legend: [[$t("Demo.reception"), '#FF6A00'], ['Housekeeping', '#0A0A0A'], [$t("Demo.all"), '#A1A1AA']],
      brief: [$t("Demo.occupancyThisWeek91Room4"), $t("Demo.saturday9CAndRainOn"), $t("Demo.bookingComShareInOctober38")],
      kpis: [[$t("Demo.occupancy"), '91 %', $t("Demo.n2RoomsFreeUntilSun"), '#52525B'], [$t("Demo.directBookings"), '62 %', $t("Demo.n9PointsVsLastYear"), '#15803D'], [$t("Demo.avgRoomRate"), '148 €', $t("Demo.n6VsLastYear"), '#15803D']],
      days: [[['A', '14:00', $t("Demo.n5Arrivals")], ['B', '10:00', $t("Demo.room12DeepClean")]], [['C', '09:00', $t("Demo.saunaMaintenance")], ['A', '16:00', $t("Demo.krausGroup3Rooms")]], [['A', '11:00', $t("Demo.n7Departures")], ['B', '13:00', $t("Demo.linenDelivery")]], [['C', '18:00', $t("Demo.guestWineEvening")], ['A', '15:00', $t("Demo.weddingArrivals6Rooms")]], [['C', '', $t("Demo.weddingInTheHall")], ['B', '08:00', $t("Demo.housekeepingDoubleStaffed")]], [['A', '11:00', $t("Demo.weddingDepartures")]], [['C', '10:00', $t("Demo.bankRenovationLoan")], ['B', '09:00', $t("Demo.minibarStocktake")]]],
      liq: '86.200 €',
      liqD: $t("Demo.winterDipLowestPoint41000"),
      liqC: '#C2410C',
      series: [72, 78, 83, 86.2, 80, 71, 63, 52, 44, 41],
      liqRows: [[$t("Demo.businessAccount"), 61800, '#0A0A0A'], [$t("Demo.guestDeposits"), 14600, '#71717A'], [$t("Demo.openReceivables"), 9800, '#FF6A00'], [$t("Demo.taxReserve"), 18400, '#FFB27A'], [$t("Demo.renovationLoan"), -18400, '#DC2626']],
      todos: [[$t("Demo.giveRoom4ToADirect"), $t("Demo.bookingComCancellation2MatchingDirect"), $t("Demo.saves41")], [$t("Demo.emailSaunaPackageToGuests"), $t("Demo.rainyWeekend6BookingsLastTime"), $t("Demo.approx240")], [$t("Demo.publishWinterRate"), $t("Demo.januaryBookings30BelowLastYear"), $t("Demo.fillTheWinter")]],
      goals: [[$t("Demo.directBookings70"), 62, '#0A0A0A', $t("Demo.october62"), $t("Demo.dec2026")], [$t("Demo.renovateFloor2"), 44, '#FF6A00', $t("Demo.n35000Of80000"), $t("Demo.spring2027")], [$t("Demo.winterOccupancy60"), 38, '#71717A', $t("Demo.january38Booked"), $t("Demo.n2MoBehind")]],
      revL: $t("Demo.revenueThisWeek"),
      revSum: '31.480 €',
      rev: [3620, 3980, 3540, 4210, 6100, 5980, 4050],
      costs: [[$t("Demo.staff"), 38200, 39000], [$t("Demo.laundryAndCleaning"), 4600, 4200], [$t("Demo.energy"), 5900, 6000], [$t("Demo.portalCommission"), 5400, 4000], [$t("Demo.breakfastPurchasing"), 6100, 6400]],
      invs: [[$t("Demo.gerresheimerCompanyConference"), $t("Demo.n21DaysOverdue"), '4.280 €', 1], [$t("Demo.lehnerWeddingBalance"), $t("Demo.dueIn4Days"), '3.900 €', 0], [$t("Demo.alpenblickTravelAgency"), $t("Demo.dueIn9Days"), '1.620 €', 0]],
      vat: '18.400 €',
      rotaL: $t("Demo.rotaReceptionAndHousekeeping"),
      rota: [['Can', $t("Demo.headOfReception"), [$t("Demo.late"), $t("Demo.late"), $t("Demo.off"), $t("Demo.early"), $t("Demo.early"), $t("Demo.late"), $t("Demo.off")]], ['Elif', $t("Demo.reception"), [$t("Demo.early"), $t("Demo.early"), $t("Demo.late"), $t("Demo.off"), $t("Demo.late"), $t("Demo.early"), $t("Demo.early")]], ['Marta', 'Housekeeping', [$t("Demo.early"), $t("Demo.early"), $t("Demo.early"), $t("Demo.early"), $t("Demo.early"), $t("Demo.off"), $t("Demo.off")]], [$t("Demo.jan"), 'Housekeeping', [$t("Demo.off"), $t("Demo.early"), $t("Demo.early"), $t("Demo.early"), $t("Demo.early"), $t("Demo.early"), $t("Demo.off")]]],
      rotaNote: $t("Demo.saturdayTwoPeopleAreOnHousekeeping"),
      staff: 'Elif',
      staffShift: $t("Demo.earlyShiftReception063014"),
      tasks: [$t("Demo.welcomeFolderKraus"), $t("Demo.lateCheckOutRoom9"), $t("Demo.reserveParkingForTheWedding"), $t("Demo.updateTheSaunaList")],
      reqL: $t("Demo.bookingsAndRequests"),
      reqs: [[$t("Demo.krausFamily"), $t("Demo.wEBSITE"), $t("Demo.n3NightsFromFri2Rooms")], ['Gerresheimer AG', $t("Demo.eMAIL"), $t("Demo.conference18PplFebruary")], [$t("Demo.mrLindner"), $t("Demo.pHONE"), $t("Demo.room4SatSun")], ['Booking.com', $t("Demo.pORTAL"), $t("Demo.cancellationRoom4")]],
      rating: '4,6 ★ · 488',
      reviews: [['Petra S.', '★★★★★', $t("Demo.theBreakfastViewIsUnbeatableVery"), ''], ['Thomas K.', '★★★☆☆', $t("Demo.niceRoomButTheWiFi"), $t("Demo.thanksThomasWeReReplacingThe")]],
      stockL: $t("Demo.stockLinenMinibarBreakfast"),
      stock: [[$t("Demo.doubleBedLinen"), $t("Demo.n14SetsWeddingNeeds18"), '30', '#FF6A00', 1], [$t("Demo.towels"), $t("Demo.lastsUntilMon"), '70', '#0A0A0A', 0], [$t("Demo.minibarWater"), $t("Demo.untilFri"), '35', '#FF6A00', 1], [$t("Demo.breakfastEggs"), $t("Demo.untilThu"), '25', '#FF6A00', 1], [$t("Demo.coffeeCapsules"), $t("Demo.lasts3Weeks"), '80', '#0A0A0A', 0]],
      sl: [[$t("Demo.raiseWeekendRate"), 0, 20, 5, 0, x => '+' + x + ' €', x => x * 24 * 0.85 * 8.6], [$t("Demo.directBookingShare"), 62, 80, 2, 62, x => x + ' %', x => (x - 62) * 0.01 * 440 * 41], [$t("Demo.winterRateDiscount"), 0, 20, 5, 0, x => '−' + x + ' %', x => x * 95 - x * x * 2]],
      profit: 14200,
      ask: [[$t("Demo.howMuchDoesBookingComCost"), $t("Demo.n5400CommissionFor132Nights"), $t("Demo.pORTALSTATEMENTSBOOKINGS")], [$t("Demo.willTheMoneyLastThroughWinter"), $t("Demo.yesLowestPoint41000In"), $t("Demo.aCCOUNTBOOKINGSLOAN")], [$t("Demo.whichRoomsAreMostPopular"), $t("Demo.lakeViewDouble96OccupiedCourtyard"), $t("Demo.oCCUPANCY12MO")]],
      srcs: [[$t("Demo.hotelSoftwareOccupancy"), $t("Demo.live")], [$t("Demo.businessAccountRaiffeisen"), $t("Demo.cSVDaily")], ['Booking.com · Expedia', $t("Demo.monthlyStatement")], [$t("Demo.dATEVTaxAdviser"), $t("Demo.monthlyExport")], ['Google Business', $t("Demo.reviews")], [$t("Demo.dutyRoster"), $t("Demo.managedInRIDEFF")]]
    },
    handwerk: {
      n: $t("Demo.trades"),
      ini: 'BE',
      brand: $t("Demo.bauerElectrical"),
      tier: 'GROWTH',
      city: $t("Demo.aUGSBURG"),
      url: 'bauer-elektro.de',
      owner: ['M', 'Markus Bauer'],
      lead: ['P', 'Petra Bauer'],
      team: ['J', 'Jonas Wild'],
      claim: $t("Demo.electricalForHomesAndBusinessWallbox"),
      facts: [$t("Demo.masterCraftsman"), $t("Demo.n6Technicians"), $t("Demo.n247Emergency")],
      form: $t("Demo.requestAppointment"),
      cta: $t("Demo.requestAppointment"),
      slots: [$t("Demo.monAM"), $t("Demo.tuePM"), $t("Demo.thuAM"), $t("Demo.friAllDay")],
      req: $t("Demo.appointment"),
      legend: [[$t("Demo.teamNorth"), '#FF6A00'], [$t("Demo.teamSouth"), '#0A0A0A'], [$t("Demo.office"), '#A1A1AA']],
      brief: [$t("Demo.orderBacklog86000EnoughFor"), $t("Demo.nYM315Cable40"), $t("Demo.twoInvoicesOpenOver30Days")],
      kpis: [[$t("Demo.orderBacklog"), '86.000 €', $t("Demo.n55WeeksOfWork"), '#52525B'], [$t("Demo.utilisation"), '92 %', $t("Demo.week43Full"), '#C2410C'], [$t("Demo.openInvoices"), '11.240 €', $t("Demo.n2Over30Days"), '#C2410C']],
      days: [[['A', '07:00', $t("Demo.goggingenSiteWallbox")], ['C', '14:00', $t("Demo.writeHuberQuote")]], [['B', '07:00', $t("Demo.solarSystemKernFamily")], ['A', '08:00', $t("Demo.meterCabinetApartmentBlock")]], [['C', '10:00', $t("Demo.wholesalerSonepar")], ['A', '07:00', $t("Demo.goggingenSignOff")]], [['B', '07:00', $t("Demo.lechhausenCommercialHall")], ['C', '16:00', $t("Demo.apprenticeReview")]], [['C', '', $t("Demo.onCallJonas")]], [['C', '', $t("Demo.onCallAli")]], [['A', '07:00', $t("Demo.newBuildHaunstetten")], ['B', '07:00', $t("Demo.lechhausenDay2")]]],
      liq: '54.300 €',
      liqD: $t("Demo.squeezeEndOfNovemberIfHuber"),
      liqC: '#C2410C',
      series: [46, 49, 52, 54.3, 58, 51, 43, 39, 47, 52],
      liqRows: [[$t("Demo.businessAccount"), 38900, '#0A0A0A'], [$t("Demo.openReceivables"), 11240, '#FF6A00'], [$t("Demo.instalmentsInProgress"), 12600, '#71717A'], [$t("Demo.taxReserve"), 9600, '#FFB27A'], [$t("Demo.vanLease"), -18040, '#DC2626']],
      todos: [[$t("Demo.sendHuberQuoteToday"), $t("Demo.openFor2DaysSimilarJobs"), '+2.900 €'], [$t("Demo.orderNYMCable"), $t("Demo.n40MInStock120M"), $t("Demo.noDowntime")], [$t("Demo.remind2Invoices"), $t("Demo.n3480TotalOver30Days"), '+3.480 €']],
      goals: [[$t("Demo.revenue2026620000"), 78, '#0A0A0A', $t("Demo.n483000SoFar"), $t("Demo.onTrack")], [$t("Demo.secondVan"), 52, '#FF6A00', $t("Demo.n13000DepositOf25000"), $t("Demo.feb2027")], [$t("Demo.twoNewTechnicians"), 50, '#71717A', $t("Demo.n1Of2Hired"), $t("Demo.spring2027")]],
      revL: $t("Demo.invoicedThisWeek"),
      revSum: '23.900 €',
      rev: [4200, 5100, 3800, 6400, 4400, 0, 0],
      costs: [[$t("Demo.staff"), 41200, 42000], [$t("Demo.materials"), 18600, 17000], [$t("Demo.vehicles"), 3900, 4000], [$t("Demo.tools"), 1100, 1500], [$t("Demo.insurance"), 1240, 1240]],
      invs: [[$t("Demo.prinzPropertyManagement"), $t("Demo.n38DaysOverdue"), '2.140 €', 1], [$t("Demo.seitzFamilyWallbox"), $t("Demo.n31DaysOverdue"), '1.340 €', 1], [$t("Demo.kernSolarInstalment1"), $t("Demo.dueIn5Days"), '7.760 €', 0]],
      vat: '9.600 €',
      rotaL: $t("Demo.technicianSchedule"),
      rota: [['Jonas', $t("Demo.technicianNorth"), ['Göggingen', $t("Demo.aptBlock"), 'Göggingen', $t("Demo.off"), $t("Demo.onCall"), $t("Demo.off"), 'Haunstetten']], ['Ali', $t("Demo.technicianNorth"), ['Göggingen', $t("Demo.aptBlock"), 'Göggingen', $t("Demo.stock"), $t("Demo.off"), $t("Demo.onCall"), 'Haunstetten']], ['Sven', $t("Demo.technicianSouth"), [$t("Demo.workshop"), $t("Demo.solarKern"), $t("Demo.solarKern"), 'Lechhausen', $t("Demo.off"), $t("Demo.off"), 'Lechhausen']], ['Max', $t("Demo.apprentice"), [$t("Demo.vocationalSchool"), $t("Demo.solarKern"), $t("Demo.vocationalSchool"), 'Lechhausen', $t("Demo.off"), $t("Demo.off"), 'Lechhausen']]],
      rotaNote: $t("Demo.thursdayTeamNorthIsnTFully"),
      staff: 'Jonas',
      staffShift: $t("Demo.goggingenSite07001600"),
      tasks: [$t("Demo.connectWallbox"), $t("Demo.photosForTheReport"), $t("Demo.reserveMaterialsForHuber"), $t("Demo.logHours")],
      reqL: $t("Demo.requestsAndQuotes"),
      reqs: [[$t("Demo.huberFamily"), $t("Demo.wEBSITE"), $t("Demo.wallbox11KWGarage")], [$t("Demo.prinzPropertyManagement"), $t("Demo.eMAIL"), $t("Demo.electricalCheck12Flats")], [$t("Demo.mrOzturk"), $t("Demo.pHONE"), $t("Demo.socketsDeadEmergency")], [$t("Demo.wolfBakery"), $t("Demo.wEBSITE"), $t("Demo.newLightingSalesFloor")]],
      rating: '4,9 ★ · 126',
      reviews: [['Sandra K.', '★★★★★', $t("Demo.onTimeTidyAndExplainedEverything"), ''], ['Dieter H.', '★★★☆☆', $t("Demo.goodWorkButTheInvoiceOnly"), $t("Demo.thanksMrHWeNowInvoice")]],
      stockL: $t("Demo.stockAndMaterials"),
      stock: [[$t("Demo.nYMCable315"), $t("Demo.n40M120MPlanned"), '25', '#FF6A00', 1], [$t("Demo.circuitBreakersB16"), $t("Demo.n28Pcs"), '70', '#0A0A0A', 0], ['Wallbox 11 kW', $t("Demo.n1Pc2Jobs"), '35', '#FF6A00', 1], [$t("Demo.flushBoxes"), $t("Demo.lasts4Weeks"), '80', '#0A0A0A', 0], [$t("Demo.rCDSwitch"), $t("Demo.n3Pcs5Planned"), '40', '#FF6A00', 1]],
      sl: [[$t("Demo.raiseHourlyRate"), 0, 10, 1, 0, x => '+' + x + ' €', x => x * 6 * 150], [$t("Demo.oneMoreTechnician"), 0, 2, 1, 0, x => '+' + x, x => x * (7800 - 4600)], [$t("Demo.invoiceOnSignOffDay"), 0, 1, 1, 0, x => x ? 'ja' : 'nein', x => x * 0]],
      profit: 18600,
      ask: [[$t("Demo.canIHireAThirdTechnician"), $t("Demo.yesFromJanuaryTheBacklogCovers"), $t("Demo.jOBSWAGES12MO")], [$t("Demo.whichJobsEarnTheMost"), $t("Demo.wallboxAndSolar34MarginSmall"), $t("Demo.iNVOICESTIMESHEETS")], [$t("Demo.whoPaysLatest"), $t("Demo.propertyManagers41DaysOnAverage"), $t("Demo.aCCOUNTINVOICES")]],
      srcs: [[$t("Demo.businessAccountStadtsparkasse"), $t("Demo.cSVDaily")], [$t("Demo.invoicesLexoffice"), $t("Demo.live")], [$t("Demo.dATEVTaxAdviser"), $t("Demo.monthlyExport")], [$t("Demo.wholesalerSonepar"), $t("Demo.orders")], [$t("Demo.timesheets"), $t("Demo.teamApp")], ['Google Business', $t("Demo.reviews")]]
    },
    dienst: {
      n: $t("Demo.services"),
      ini: 'NK',
      brand: $t("Demo.nordlichtCommunications"),
      tier: 'STARTER',
      city: 'NÜRNBERG',
      url: 'nordlicht-kommunikation.de',
      owner: ['A', 'Anna Roth'],
      lead: ['D', 'David Klein'],
      team: ['S', 'Sophie Lang'],
      claim: $t("Demo.communicationsAgencyForMidSizedCompanies"),
      facts: [$t("Demo.n8People"), $t("Demo.since2014"), $t("Demo.midSizedFirms")],
      form: $t("Demo.bookAFirstCall"),
      cta: $t("Demo.requestAppointment"),
      slots: [$t("Demo.mon1000"), 'Di 14:00', 'Do 09:00', 'Fr 11:00'],
      req: $t("Demo.freeCall"),
      legend: [[$t("Demo.projects"), '#FF6A00'], [$t("Demo.sales"), '#0A0A0A'], [$t("Demo.office"), '#A1A1AA']],
      brief: [$t("Demo.utilisationNextWeek104DavidAnd"), $t("Demo.theStadtwerkeProjectIs18Hours"), $t("Demo.twoQuotesAwaitingReply46000")],
      kpis: [[$t("Demo.utilisation"), '87 %', $t("Demo.nextWeek104"), '#C2410C'], ['Pipeline', '46.000 €', $t("Demo.n2QuotesOpen"), '#52525B'], [$t("Demo.openInvoices"), '18.600 €', $t("Demo.allOnTarget"), '#15803D']],
      days: [[['A', '10:00', $t("Demo.stadtwerkeWorkshop")], ['B', '15:00', 'Pitch Brose']], [['A', '09:00', $t("Demo.schaefflerWebsiteCopy")], ['C', '14:00', $t("Demo.bookkeeping")]], [['B', '11:00', $t("Demo.firstCallWolfBakery")], ['A', '16:00', $t("Demo.campaignSignOff")]], [['A', '10:00', $t("Demo.tradeFairPhotoShoot")], ['B', '', $t("Demo.broseDecision")]], [], [], [['C', '09:30', 'Team-Weekly'], ['A', '13:00', $t("Demo.schaefflerKickOff")]]],
      liq: '62.800 €',
      liqD: $t("Demo.stable41MonthsOfFixed"),
      liqC: '#15803D',
      series: [54, 57, 55, 59, 61, 60, 62.8, 64, 66, 67],
      liqRows: [[$t("Demo.businessAccount"), 48200, '#0A0A0A'], [$t("Demo.openReceivables"), 18600, '#FF6A00'], [$t("Demo.taxReserve"), 11200, '#FFB27A'], [$t("Demo.savingsAccount"), 7000, '#71717A'], [$t("Demo.overdraft"), 0, '#DC2626']],
      todos: [[$t("Demo.sendStadtwerkeChangeOrder"), $t("Demo.n18HoursOverBudgetDraftReady"), '+1.710 €'], [$t("Demo.lightenFriday"), $t("Demo.davidAndSophiePlannedOver40"), $t("Demo.noBurnout")], [$t("Demo.followUpBrose"), $t("Demo.decisionOnFriday"), '+28.000 €']],
      goals: [['Umsatz 2026: 720.000 €', 74, '#0A0A0A', '533.000 € bisher', $t("Demo.onTrack")], [$t("Demo.noClientOver25"), 60, '#FF6A00', $t("Demo.largestClient31"), $t("Demo.byMid2027")], [$t("Demo.n4MonthsOfReserves"), 100, '#71717A', $t("Demo.n62800Reached"), 'erreicht']],
      revL: $t("Demo.billedHoursThisWeek"),
      revSum: '186 h',
      rev: [38, 42, 40, 36, 30, 0, 0],
      costs: [[$t("Demo.salaries"), 44800, 45000], ['Freelancer', 6200, 5000], [$t("Demo.officeRent"), 3400, 3400], ['Software', 1180, 1200], [$t("Demo.travel"), 860, 1000]],
      invs: [[$t("Demo.stadtwerkePhase2"), $t("Demo.dueIn3Days"), '9.800 €', 0], [$t("Demo.schaefflerDeposit"), $t("Demo.dueIn10Days"), '6.000 €', 0], [$t("Demo.wolfBakeryLogo"), $t("Demo.dueIn14Days"), '2.800 €', 0]],
      vat: '11.200 €',
      rotaL: $t("Demo.capacityPerPerson"),
      rota: [['David', $t("Demo.projectLead"), ['Stadtwerke', 'Schaeffler', 'Stadtwerke', $t("Demo.tradeFair"), 'Brose', $t("Demo.off"), 'Schaeffler']], ['Sophie', $t("Demo.copy"), ['Stadtwerke', 'Schaeffler', 'Schaeffler', $t("Demo.tradeFair"), 'Schaeffler', $t("Demo.off"), 'Schaeffler']], ['Lukas', 'Design', [$t("Demo.campaign"), $t("Demo.campaign"), $t("Demo.signOff"), $t("Demo.tradeFair"), $t("Demo.off"), $t("Demo.off"), 'Kick-off']], ['Anna', $t("Demo.management"), ['Pitch', $t("Demo.office"), $t("Demo.sales"), $t("Demo.tradeFair"), 'Brose', $t("Demo.off"), 'Weekly']]],
      rotaNote: $t("Demo.lukasIsFreeOnFridaySome"),
      staff: 'Sophie',
      staffShift: $t("Demo.todayStadtwerke6HPlanned"),
      tasks: [$t("Demo.stadtwerkeHomepageCopy"), $t("Demo.workInFeedback"), $t("Demo.logHours2"), $t("Demo.readSchaefflerBrief")],
      reqL: $t("Demo.requestsAndPipeline"),
      reqs: [[$t("Demo.wolfBakery"), $t("Demo.wEBSITE"), $t("Demo.firstCallNewBrand")], ['Brose', $t("Demo.eMAIL"), $t("Demo.quote28000DecisionFri")], ['IHK Nürnberg', $t("Demo.pHONE"), $t("Demo.talkOnCommunicationMarch")], ['Schaeffler', $t("Demo.eMAIL"), $t("Demo.followUpJobTradeFair2027")]],
      rating: '4,8 ★ · 41',
      reviews: [['Michael B.', '★★★★★', $t("Demo.finallyMadeOurMessageClearVery"), ''], ['Claudia F.', '★★★☆☆', $t("Demo.goodResultsButApprovalsSometimesTook"), $t("Demo.thanksClaudiaWeVeIntroducedFixed")]],
      stockL: $t("Demo.licencesAndSubscriptions"),
      stock: [[$t("Demo.adobeCCTeamLicence"), $t("Demo.n8Of8InUse"), '100', '#FF6A00', 1], [$t("Demo.stockPhotoQuota"), $t("Demo.n12ImagesLeft"), '20', '#FF6A00', 1], [$t("Demo.projectSoftware"), $t("Demo.runsUntil032027"), '80', '#0A0A0A', 0], [$t("Demo.fontLicences"), $t("Demo.webFor3Domains"), '60', '#0A0A0A', 0], [$t("Demo.cloudStorage"), $t("Demo.n78Full"), '78', '#0A0A0A', 0]],
      sl: [[$t("Demo.raiseDayRate"), 0, 150, 25, 0, x => '+' + x + ' €', x => x * 0.87 * 8 * 21 / 8 * 6], [$t("Demo.oneMorePerson"), 0, 2, 1, 0, x => '+' + x, x => x * (9800 - 6200)], [$t("Demo.freelancersInsteadOfOvertime"), 0, 40, 10, 0, x => x + ' h', x => -x * 45]],
      profit: 12400,
      ask: [[$t("Demo.whichClientIsTooBig"), $t("Demo.stadtwerke31OfRevenueIfThe"), $t("Demo.iNVOICES12MOACCOUNT")], [$t("Demo.areOurDayRatesTooLow"), $t("Demo.probablyYesProjectsRun14Over"), $t("Demo.tIMETRACKINGQUOTES")], [$t("Demo.whoIsOverloadedNextWeek"), $t("Demo.david46HAndSophie44"), $t("Demo.cAPACITYWK43")]],
      srcs: [[$t("Demo.businessAccountGLS"), $t("Demo.cSVDaily")], [$t("Demo.timeTrackingClockify"), $t("Demo.live")], [$t("Demo.invoicesSevDesk"), $t("Demo.live")], [$t("Demo.dATEVTaxAdviser"), $t("Demo.monthlyExport")], ['CRM · Pipedrive', $t("Demo.offers")], [$t("Demo.googleCalendar"), $t("Demo.team")]]
    }
  };
}
const OC = {
  A: '#FF6A00',
  B: '#0A0A0A',
  C: '#A1A1AA'
};
const fmt = n => (n < 0 ? '−' : '') + Math.round(Math.abs(n)).toLocaleString('de-DE') + ' €';
const T = s => $tx(s);
class Logic extends DCLogic {
  state = {
    lang: this.props.locale,
    ind: 'cafe',
    role: 'O',
    nav: 'home',
    bi: 0,
    done: {},
    tdone: {},
    inv: {},
    rq: {},
    rv: {},
    st: {},
    src: {},
    wi: {},
    extra: [],
    name: '',
    slot: 0,
    sent: false,
    flash: false,
    ask: false,
    q: '',
    open: -1,
    w: 1400
  };
  componentDidMount() {
    this._r = () => this.setState({
      w: window.innerWidth
    });
    this._r();
    window.addEventListener('resize', this._r);
    this._k = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.setState({
          ask: true
        });
      }
      if (e.key === 'Escape') this.setState({
        ask: false
      });
    };
    window.addEventListener('keydown', this._k);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._r);
    window.removeEventListener('keydown', this._k);
    clearTimeout(this._f);
  }
  renderVals() {
    const s = this.state,
      set = o => this.setState(o),
      d = IND[s.ind],
      K = s.ind + ':',
      wide = s.w >= 980,
      role = s.role;
    const tog = (f, k) => this.setState(st => ({
        [f]: {
          ...st[f],
          [K + k]: !st[f][K + k]
        }
      })),
      on = (f, k) => !!s[f][K + k];
    const ex = s.extra.filter(x => x.ind === s.ind);
    const allowed = k => role === 'O' || (role === 'L' ? !['fin', 'what', 'data'].includes(k) : ['home', 'team', 'kunden'].includes(k));
    const NAV = [['home', '⌂', this.props.t("Demo.overview")], ['fin', '€', this.props.t("Demo.finances")], ['team', '◷', this.props.t("Demo.teamShifts")], ['kunden', '✉', this.props.t("Demo.customersRequests")], ['lager', '▤', this.props.t("Demo.stockPurchasing")], ['web', '◐', this.props.t("Demo.website")], ['what', '≋', this.props.t("Demo.whatIf")], ['data', '☑', this.props.t("Demo.dataPermissions")]];
    const nav = keys => NAV.filter(n => keys.includes(n[0])).map(([k, i, l]) => ({
      i,
      l,
      bg: s.nav === k ? '#F5F5F4' : 'transparent',
      fg: s.nav === k ? '#0A0A0A' : allowed(k) ? '#D4D4D8' : '#52525B',
      ic: s.nav === k ? '#FF6A00' : '#71717A',
      badge: k === 'kunden' && ex.length > 0,
      b: String(ex.length),
      on: () => set({
        nav: k
      })
    }));
    const vis = k => s.nav === k && allowed(k);
    const ser = d.series,
      mn = Math.min(...ser),
      mx = Math.max(...ser),
      Wd = 400,
      H = 120,
      pts = ser.map((v, i) => [i / (ser.length - 1) * Wd, H - 8 - (v - mn) / (mx - mn || 1) * (H - 20)]),
      line = pts.map(p => p.join(',')).join(' '),
      mi = ser.indexOf(mn);
    const chart = React.createElement('svg', {
      viewBox: `0 0 ${Wd} ${H}`,
      preserveAspectRatio: 'none',
      style: {
        width: '100%',
        height: '100%',
        display: 'block'
      }
    }, React.createElement('line', {
      x1: pts[3][0],
      x2: pts[3][0],
      y1: 0,
      y2: H,
      stroke: '#E4E4E1',
      strokeDasharray: '3 3',
      vectorEffect: 'non-scaling-stroke'
    }), React.createElement('polygon', {
      points: `0,${H} ${line} ${Wd},${H}`,
      fill: 'rgba(255,106,0,0.08)'
    }), React.createElement('polyline', {
      points: line,
      fill: 'none',
      stroke: '#0A0A0A',
      strokeWidth: 2,
      strokeLinejoin: 'round',
      vectorEffect: 'non-scaling-stroke'
    }), React.createElement('circle', {
      cx: pts[mi][0],
      cy: pts[mi][1],
      r: 4,
      fill: '#FF6A00'
    }));
    const me = role === 'O' ? d.owner : role === 'L' ? d.lead : d.team,
      rn = {
        O: this.props.t("Demo.owner"),
        L: this.props.t("Demo.manager"),
        T: this.props.t("Demo.team")
      };
    const myTasks = d.tasks.map((x, i) => {
      const o = on('tdone', i);
      return {
        x,
        ck: o ? '✓' : '',
        bg: o ? '#22A355' : '#fff',
        bd: o ? '#22A355' : '#D4D4D8',
        c: o ? '#71717A' : '#0A0A0A',
        td: o ? 'line-through' : 'none',
        on: () => tog('tdone', i)
      };
    });
    const reqs = [...ex.slice().reverse().map((x, i) => ({
      n: x.n,
      src: this.props.t("Demo.wEBSITE"),
      x: x.x,
      key: 'x' + x.id,
      hl: i === 0 && s.flash ? 'rgba(255,106,0,0.12)' : 'transparent'
    })), ...d.reqs.map(([n, src, x], i) => ({
      n,
      src,
      x,
      key: i,
      hl: 'transparent'
    }))];
    const wv = k => s.wi[K + k] ?? d.sl[k][4];
    const dP = d.sl.reduce((a, sl, k) => a + sl[6](wv(k)) - sl[6](sl[4]), 0),
      P = d.profit + dP;
    const nDone = d.todos.filter((_, i) => on('done', i)).length;
    return {
      cols: wide ? '280px minmax(0,1fr)' : 'minmax(0,1fr)',
      sideDisp: wide ? 'flex' : 'none',
      pad: wide ? '36px 40px 56px' : '22px 18px 40px',
      narrow: !wide,
      d,
      langs: ['de', 'en'].map(k => ({
        k: k.toUpperCase(),
        bg: s.lang === k ? '#F5F5F4' : 'transparent',
        fg: s.lang === k ? '#0A0A0A' : '#A1A1AA',
        on: () => this.props.switchLocale(k.toLowerCase())
      })),
      inds: Object.keys(IND).map(k => ({
        n: IND[k].n,
        bg: s.ind === k ? '#F5F5F4' : 'transparent',
        fg: s.ind === k ? '#0A0A0A' : '#D4D4D8',
        bd: s.ind === k ? '#F5F5F4' : '#2A2A2E',
        on: () => set({
          ind: k,
          bi: 0,
          sent: false,
          slot: 0
        })
      })),
      navTop: nav(['home']),
      navMod: nav(['fin', 'team', 'kunden', 'lager', 'web']),
      navTool: nav(['what', 'data']),
      navAll: nav(NAV.map(n => n[0])),
      roles: ['O', 'L', 'T'].map(k => {
        const p = k === 'O' ? d.owner : k === 'L' ? d.lead : d.team;
        return {
          i: p[0],
          n: rn[k],
          bg: role === k ? '#0A0A0A' : 'transparent',
          fg: role === k ? '#fff' : '#0A0A0A',
          ab: role === k ? '#FF6A00' : '#EDEDEB',
          af: role === k ? '#fff' : '#0A0A0A',
          on: () => set({
            role: k
          })
        };
      }),
      me: {
        i: me[0],
        n: me[1],
        r: rn[role].toUpperCase()
      },
      dateLine: T(this.props.t("Demo.tUESDAY13OCTOBER")) + ' ' + T(d.city),
      title: s.nav === 'home' ? T(this.props.t("Demo.goodMorning")) + ' ' + me[1].split(' ')[0] : NAV.find(n => n[0] === s.nav)[2],
      locked: !allowed(s.nav),
      goHome: () => set({
        nav: 'home'
      }),
      isHome: vis('home'),
      isFin: vis('fin'),
      isTeam: vis('team'),
      isKunden: vis('kunden'),
      isLager: vis('lager'),
      isWeb: vis('web'),
      isWhat: vis('what'),
      isData: vis('data'),
      brief: d.brief[s.bi % 3],
      briefPos: s.bi % 3 + 1 + ' / 3',
      nextBrief: () => set({
        bi: s.bi + 1
      }),
      kpis: (role === 'T' ? [[this.props.t("Demo.myShift"), d.staffShift.split(' · ').pop(), d.staffShift.split(' · ')[0], '#52525B'], [this.props.t("Demo.tasksToday"), myTasks.filter(t => t.ck).length + ' / 4', this.props.t("Demo.inTheTeamApp"), '#52525B'], [this.props.t("Demo.newEnquiries"), String(d.reqs.length + ex.length), 'heute', '#C2410C']] : role === 'L' ? [d.kpis[0], [this.props.t("Demo.teamToday"), String(d.rota.length), this.props.t("Demo.allShiftsCovered"), '#15803D'], [this.props.t("Demo.newEnquiries"), String(d.reqs.length + ex.length), 'heute', '#C2410C']] : d.kpis).map(([l, v, sub, sc]) => ({
        l,
        v,
        s: sub,
        sc
      })),
      legend: d.legend.map(([n, c]) => ({
        n,
        c
      })),
      days: d.days.map((ev, i) => ({
        d: DN[i],
        sub: i === 0 ? this.props.t("Demo.today") : i === 1 ? this.props.t("Demo.tomorrow") : '',
        ev: ev.map(([o, t, x]) => ({
          t,
          x,
          c: OC[o],
          bg: o === 'A' ? '#FFF4EC' : '#F4F4F2',
          bd: o === 'A' ? '#FFE0C7' : '#EDEDEB'
        }))
      })),
      showMoney: role === 'O',
      hideMoney: role !== 'O',
      chart,
      liqRows: d.liqRows.map(([n, v, c]) => ({
        n,
        c,
        v: fmt(v),
        vc: v < 0 ? '#DC2626' : '#0A0A0A'
      })),
      myTasks,
      todos: d.todos.map(([x, why, g], i) => {
        const o = on('done', i);
        return {
          x,
          why,
          g,
          ck: o ? '✓' : '',
          cf: o ? '#22A355' : '#fff',
          cb: o ? '#22A355' : '#D4D4D8',
          td: o ? 'line-through' : 'none',
          bg: o ? '#F0FAF3' : '#FAFAF9',
          bd: o ? '#BBE5C8' : '#EDEDEB',
          on: () => tog('done', i)
        };
      }),
      doneN: nDone + ' / 3',
      goals: d.goals.map(([n, pc, c, sub, dd]) => ({
        n,
        p: pc + ' %',
        w: pc + '%',
        c,
        s: sub,
        d: dd,
        dc: dd.includes('hinten') ? '#C2410C' : '#71717A'
      })),
      rev: (() => {
        const m = Math.max(...d.rev);
        return d.rev.map((v, i) => ({
          v: v ? v >= 1000 ? (v / 1000).toFixed(1).replace('.', ',') + 'k' : String(v) : '–',
          h: Math.max(v / m * 78, 2) + '%',
          d: W7[i].slice(0, 2),
          c: i === 3 ? '#FF6A00' : '#0A0A0A'
        }));
      })(),
      costs: d.costs.map(([n, v, b]) => {
        const r = v / b;
        return {
          n,
          v: fmt(v),
          b: fmt(b),
          w: Math.min(r, 1) * 100 + '%',
          c: r > 1 ? '#DC2626' : r > 0.95 ? '#FF6A00' : '#A1A1AA',
          vc: r > 1 ? '#DC2626' : '#0A0A0A'
        };
      }),
      invSum: fmt(d.invs.reduce((a, x, i) => a + (on('inv', i) && x[3] ? 0 : parseFloat(x[2].replace(/\./g, ''))), 0)),
      invs: d.invs.map(([n, dd, a, late], i) => {
        const o = on('inv', i);
        return {
          n,
          a,
          d: o ? this.props.t("Demo.reminderSentToday") : dd,
          dc: late && !o ? '#C2410C' : '#71717A',
          btn: o ? this.props.t("Demo.sENT") : late ? this.props.t("Demo.rEMIND") : this.props.t("Demo.vIEW"),
          bg: o ? '#E8F7EE' : late ? '#0A0A0A' : '#fff',
          fg: o ? '#14532D' : late ? '#fff' : '#0A0A0A',
          bd: o ? '#BBE5C8' : late ? '#0A0A0A' : '#E4E4E1',
          on: () => late && tog('inv', i)
        };
      }),
      wkDays: W7,
      rota: d.rota.map(([n, r, c]) => ({
        n,
        r,
        c: c.map(x => {
          const free = x === this.props.t("Demo.off"),
            nd = /Notdienst|Nacht/.test(x),
            sch = /Berufsschule/.test(x);
          return {
            x,
            t: '',
            bg: free ? '#E8F7EE' : nd ? '#27272A' : sch ? '#EDEDEB' : /A$|Nord|Spät|Früh$/.test(x) && !/B$/.test(x) ? '#FFE7D6' : '#F4F4F2',
            fg: nd ? '#fff' : free ? '#14532D' : '#0A0A0A'
          };
        })
      })),
      hasNew: ex.length > 0,
      lastReq: ex.length ? ex[ex.length - 1].n + ' · ' + ex[ex.length - 1].x : '',
      reqs: reqs.map(q => {
        const o = on('rq', q.key);
        return {
          ...q,
          sc: q.src === this.props.t("Demo.wEBSITE") ? '#C2410C' : '#71717A',
          btn: o ? this.props.t("Demo.cONFIRMED") : this.props.t("Demo.aCCEPT"),
          bg: o ? '#E8F7EE' : '#0A0A0A',
          fg: o ? '#14532D' : '#fff',
          bd: o ? '#BBE5C8' : '#0A0A0A',
          on: () => tog('rq', q.key)
        };
      }),
      reviews: d.reviews.map(([n, st, x, draft], i) => {
        const o = on('rv', i);
        return {
          n,
          s: st,
          x,
          draft,
          needs: !!draft,
          btn: o ? this.props.t("Demo.pUBLISHED") : this.props.t("Demo.sENDREPLY"),
          bbg: o ? '#E8F7EE' : '#0A0A0A',
          bfg: o ? '#14532D' : '#fff',
          on: () => tog('rv', i)
        };
      }),
      stock: d.stock.map(([n, dd, w, c, low], i) => {
        const o = on('st', i);
        return {
          n,
          d: o ? this.props.t("Demo.orderedDeliveryIn2Days") : dd,
          dc: low && !o ? '#C2410C' : '#71717A',
          w: (o ? 100 : +w) + '%',
          c: o ? '#22A355' : c,
          vis: low ? 'visible' : 'hidden',
          btn: o ? this.props.t("Demo.oRDERED") : this.props.t("Demo.oRDER"),
          bg: o ? '#E8F7EE' : '#0A0A0A',
          fg: o ? '#14532D' : '#fff',
          bd: o ? '#BBE5C8' : '#0A0A0A',
          on: () => tog('st', i)
        };
      }),
      name: s.name,
      setName: e => set({
        name: e.target.value
      }),
      slots: d.slots.map((x, i) => ({
        x,
        bg: s.slot === i ? '#0A0A0A' : '#fff',
        fg: s.slot === i ? '#fff' : '#0A0A0A',
        bd: s.slot === i ? '#0A0A0A' : '#E4E4E1',
        on: () => set({
          slot: i
        })
      })),
      submit: () => {
        const n = s.name.trim() || this.props.t("Demo.newCustomer");
        this.setState(st => ({
          extra: [...st.extra, {
            id: Date.now(),
            ind: st.ind,
            n,
            x: d.req + ' · ' + d.slots[st.slot]
          }],
          sent: true,
          name: '',
          flash: true
        }));
        clearTimeout(this._f);
        this._f = setTimeout(() => set({
          flash: false
        }), 2600);
      },
      sent: s.sent,
      goKunden: () => set({
        nav: 'kunden',
        sent: false
      }),
      sliders: d.sl.map(([n, min, max, step, def, f], k) => ({
        n,
        min,
        max,
        step,
        val: wv(k),
        v: f(wv(k)),
        on: e => {
          const x = +e.target.value;
          this.setState(st => ({
            wi: {
              ...st.wi,
              [K + k]: x
            }
          }));
        }
      })),
      wi: {
        p: fmt(P),
        dl: (dP >= 0 ? '+' : '') + fmt(dP) + ' ' + T(this.props.t("Demo.tOTODAY")),
        c: dP >= 0 ? '#86EFAC' : '#FCA5A5',
        rows: [[this.props.t("Demo.profitPerYear"), fmt(P * 12), '#F5F5F4'], [d.goals[1][0], (() => {
          const m0 = 5,
            m = Math.max(1, Math.round(m0 * d.profit / Math.max(P, 1))),
            t = new Date(2026, 9 + m, 1);
          return [this.props.t("Demo.jan"), this.props.t("Demo.feb"), this.props.t("Demo.march"), this.props.t("Demo.april"), this.props.t("Demo.may"), this.props.t("Demo.june"), this.props.t("Demo.july"), this.props.t("Demo.aug"), this.props.t("Demo.sep"), this.props.t("Demo.oct"), this.props.t("Demo.nov"), this.props.t("Demo.dec")][t.getMonth()] + ' ' + t.getFullYear();
        })(), dP > 0 ? '#FF9A50' : '#F5F5F4'], [this.props.t("Demo.cashIn90Days"), fmt(ser[ser.length - 1] * 1000 + dP * 3), '#F5F5F4']].map(([n, v, c]) => ({
          n,
          v,
          c
        }))
      },
      wiReset: () => this.setState(st => {
        const w = {
          ...st.wi
        };
        d.sl.forEach((_, k) => delete w[K + k]);
        return {
          wi: w
        };
      }),
      srcs: d.srcs.map(([n, dd], i) => {
        const o = s.src[K + i] !== false;
        return {
          n,
          d: dd,
          bg: o ? '#FF6A00' : '#D4D4D8',
          jc: o ? 'flex-end' : 'flex-start',
          on: () => this.setState(st => ({
            src: {
              ...st.src,
              [K + i]: !o
            }
          }))
        };
      }),
      srcOn: d.srcs.filter((_, i) => s.src[K + i] !== false).length + ' ' + T(this.props.t("Demo.oF6ON")),
      perms: [[T(this.props.t("Demo.owner2")) + ' ' + d.owner[1], [this.props.t("Demo.everything"), 1]], [T(this.props.t("Demo.manager2")) + ' ' + d.lead[1], [this.props.t("Demo.overview"), 1], [this.props.t("Demo.team"), 1], [this.props.t("Demo.customers"), 1], [this.props.t("Demo.stock"), 1], [this.props.t("Demo.website"), 1], [this.props.t("Demo.finances"), 0]], [this.props.t("Demo.team"), [this.props.t("Demo.shifts"), 1], [this.props.t("Demo.tasks"), 1], [this.props.t("Demo.requests"), 1], [this.props.t("Demo.finances"), 0], [this.props.t("Demo.stock"), 0]]].map(([n, ...it]) => ({
        n,
        items: it.map(([x, ok]) => ({
          x: (ok ? '✓ ' : '✕ ') + T(x),
          bg: ok ? '#E8F7EE' : '#F4F4F2',
          fg: ok ? '#14532D' : '#71717A'
        }))
      })),
      ask: s.ask,
      openAsk: () => set({
        ask: true
      }),
      closeAsk: () => set({
        ask: false,
        open: -1
      }),
      stop: e => e.stopPropagation(),
      q: s.q,
      qChange: e => set({
        q: e.target.value
      }),
      sugg: d.ask.filter(x => !s.q || x[0].toLowerCase().includes(s.q.toLowerCase())).map(([q, a, src], i) => ({
        q,
        a,
        src,
        open: s.open === i,
        bg: s.open === i ? '#F4F4F2' : 'transparent',
        on: () => set({
          open: s.open === i ? -1 : i
        })
      }))
    };
  }
}

Logic.prototype.render = function render() {
  const v = { ...this.props, ...this.renderVals() };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: "body{margin:0;background:#F4F4F2;font-family:var(--font-sans);color:#0A0A0A;-webkit-font-smoothing:antialiased}*{box-sizing:border-box}[data-tabs]::-webkit-scrollbar{display:none}a{color:#C2410C;text-decoration:none}a:hover{color:#FF6A00}input{font-family:inherit}" }} />
      <div data-screen-label="Business App" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: `${v.cols ?? ''}`, backgroundColor: "#F4F4F2", backgroundImage: "radial-gradient(#DADAD6 1px,transparent 1px)", backgroundSize: "22px 22px" }}>
        <aside style={{ display: `${v.sideDisp ?? ''}`, flexDirection: "column", gap: "18px", padding: "22px 18px", background: "#0B0B0C", color: "#F5F5F4", position: "sticky", top: "0", height: "100vh", overflowY: "auto", backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)", backgroundSize: "56px 56px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#FF6A00", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px", letterSpacing: "-0.03em" }}>
              {v.tx(v.d?.ini)}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
              <span style={{ fontSize: "17px", fontWeight: "700", letterSpacing: "-0.02em" }}>
                {v.tx(v.d?.brand)}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", color: "#A1A1AA" }}>
                {v.t("Demo.rIDEFFBUSINESS")}{" "}{v.tx(v.d?.tier)}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", color: "#71717A" }}>
              {v.t("Demo.iNDUSTRYDEMO")}
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "4px" }}>
              {(v.inds ?? []).map((i, $index) => (<Fragment key={$index}>
                <button onClick={i?.on} style={{ fontSize: "13px", fontWeight: "600", padding: "8px 10px", borderRadius: "9px", cursor: "pointer", fontFamily: "inherit", border: `1px solid ${i?.bd ?? ''}`, background: `${i?.bg ?? ''}`, color: `${i?.fg ?? ''}` }}>
                  {v.tx(i?.n)}
                </button>
              </Fragment>))}
            </div>
          </div>
          <button onClick={v.openAsk} style={{ display: "flex", gap: "10px", alignItems: "center", padding: "12px 14px", borderRadius: "12px", border: "1px solid #2A2A2E", background: "#141416", color: "#A1A1AA", fontSize: "14px", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }} className="hv-e24b746">
            <span style={{ width: "7px", height: "7px", borderRadius: "9999px", background: "#FF6A00" }} />
            <span style={{ flex: "1" }}>
              {v.t("Demo.askTheCockpit")}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "2px 6px", borderRadius: "5px", border: "1px solid #2A2A2E" }}>
              {"⌘K"}
            </span>
          </button>
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {(v.navTop ?? []).map((n, $index) => (<Fragment key={$index}>
              <button onClick={n?.on} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 14px", borderRadius: "12px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "15px", fontWeight: "600", textAlign: "left", background: `${n?.bg ?? ''}`, color: `${n?.fg ?? ''}` }} className="hv-f3f5aac">
                <span style={{ width: "20px", fontFamily: "var(--font-mono)", fontSize: "13px", color: `${n?.ic ?? ''}` }}>
                  {v.tx(n?.i)}
                </span>
                <span style={{ flex: "1" }}>
                  {v.tx(n?.l)}
                </span>
                {n?.badge ? (<>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "2px 7px", borderRadius: "9999px", background: "#FF6A00", color: "#fff" }}>
                    {v.tx(n?.b)}
                  </span>
                </>) : null}
              </button>
            </Fragment>))}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", color: "#71717A", padding: "14px 14px 6px" }}>
              {v.t("Demo.mODULES")}
            </span>
            {(v.navMod ?? []).map((n, $index) => (<Fragment key={$index}>
              <button onClick={n?.on} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 14px", borderRadius: "12px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "15px", fontWeight: "500", textAlign: "left", background: `${n?.bg ?? ''}`, color: `${n?.fg ?? ''}` }} className="hv-f3f5aac">
                <span style={{ width: "20px", fontFamily: "var(--font-mono)", fontSize: "13px", color: `${n?.ic ?? ''}` }}>
                  {v.tx(n?.i)}
                </span>
                <span style={{ flex: "1" }}>
                  {v.tx(n?.l)}
                </span>
                {n?.badge ? (<>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "2px 7px", borderRadius: "9999px", background: "#FF6A00", color: "#fff" }}>
                    {v.tx(n?.b)}
                  </span>
                </>) : null}
              </button>
            </Fragment>))}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", color: "#71717A", padding: "14px 14px 6px" }}>
              {v.t("Demo.tOOLS")}
            </span>
            {(v.navTool ?? []).map((n, $index) => (<Fragment key={$index}>
              <button onClick={n?.on} style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 14px", borderRadius: "12px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "15px", fontWeight: "500", textAlign: "left", background: `${n?.bg ?? ''}`, color: `${n?.fg ?? ''}` }} className="hv-f3f5aac">
                <span style={{ width: "20px", fontFamily: "var(--font-mono)", fontSize: "13px", color: `${n?.ic ?? ''}` }}>
                  {v.tx(n?.i)}
                </span>
                <span style={{ flex: "1" }}>
                  {v.tx(n?.l)}
                </span>
              </button>
            </Fragment>))}
          </div>
          <div data-no-i18n="" style={{ marginTop: "auto", display: "flex", gap: "2px", padding: "3px", borderRadius: "9999px", border: "1px solid #2A2A2E", background: "#141416", alignSelf: "flex-start" }}>
            {(v.langs ?? []).map((l, $index) => (<Fragment key={$index}>
              <button onClick={l?.on} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", padding: "6px 12px", borderRadius: "9999px", border: "none", cursor: "pointer", background: `${l?.bg ?? ''}`, color: `${l?.fg ?? ''}` }}>
                {v.tx(l?.k)}
              </button>
            </Fragment>))}
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "12px 14px", borderRadius: "14px", border: "1px solid #26262A", background: "#111113" }}>
            <span style={{ width: "36px", height: "36px", borderRadius: "9999px", background: "#FF6A00", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
              {v.tx(v.me?.i)}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "0" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {v.tx(v.me?.n)}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", color: "#A1A1AA" }}>
                {v.tx(v.me?.r)}
              </span>
            </div>
          </div>
        </aside>
        <main style={{ minWidth: "0", padding: `${v.pad ?? ''}`, display: "flex", flexDirection: "column", gap: "18px" }}>
          {v.narrow ? (<>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "-22px -18px 0", padding: "14px 18px", background: "#0B0B0C", position: "sticky", top: "0", zIndex: "5" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ display: "flex", gap: "10px", alignItems: "center", color: "#F5F5F4" }}>
                  <span style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#FF6A00", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px" }}>
                    {v.tx(v.d?.ini)}
                  </span>
                  <span style={{ fontSize: "15px", fontWeight: "700" }}>
                    {v.tx(v.d?.brand)}
                  </span>
                </span>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                  {(v.inds ?? []).map((i, $index) => (<Fragment key={$index}>
                    <button onClick={i?.on} style={{ fontSize: "12px", fontWeight: "600", padding: "6px 10px", borderRadius: "9999px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", border: `1px solid ${i?.bd ?? ''}`, background: `${i?.bg ?? ''}`, color: `${i?.fg ?? ''}` }}>
                      {v.tx(i?.n)}
                    </button>
                  </Fragment>))}
                  <button onClick={v.openAsk} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "7px 11px", borderRadius: "9999px", border: "1px solid #2A2A2E", background: "#141416", color: "#A1A1AA", cursor: "pointer" }}>
                    {"⌘K"}
                  </button>
                  <div data-no-i18n="" style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "9999px", border: "1px solid #2A2A2E", background: "#141416" }}>
                    {(v.langs ?? []).map((l, $index) => (<Fragment key={$index}>
                      <button onClick={l?.on} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", padding: "5px 9px", borderRadius: "9999px", border: "none", cursor: "pointer", background: `${l?.bg ?? ''}`, color: `${l?.fg ?? ''}` }}>
                        {v.tx(l?.k)}
                      </button>
                    </Fragment>))}
                  </div>
                </div>
              </div>
              <div data-tabs="1" style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "2px", scrollbarWidth: "none", WebkitMaskImage: "linear-gradient(90deg,#000 88%,transparent)", maskImage: "linear-gradient(90deg,#000 88%,transparent)" }}>
                {(v.navAll ?? []).map((n, $index) => (<Fragment key={$index}>
                  <button onClick={n?.on} style={{ flex: "none", whiteSpace: "nowrap", display: "flex", gap: "8px", alignItems: "center", padding: "9px 13px", borderRadius: "9999px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: "600", background: `${n?.bg ?? ''}`, color: `${n?.fg ?? ''}` }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: `${n?.ic ?? ''}` }}>
                      {v.tx(n?.i)}
                    </span>
                    {v.tx(n?.l)}
                  </button>
                </Fragment>))}
              </div>
            </div>
          </>) : null}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", letterSpacing: "0.16em", color: "#71717A" }}>
                {v.tx(v.dateLine)}
              </span>
              <span style={{ fontSize: "clamp(30px,3.6vw,46px)", fontWeight: "700", letterSpacing: "-0.045em", lineHeight: "1" }}>
                {v.tx(v.title)}
              </span>
            </div>
            <div style={{ display: "flex", gap: "4px", padding: "5px", borderRadius: "9999px", background: "#fff", border: "1px solid #E4E4E1" }}>
              {(v.roles ?? []).map((r, $index) => (<Fragment key={$index}>
                <button onClick={r?.on} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "6px 14px 6px 6px", borderRadius: "9999px", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", background: `${r?.bg ?? ''}`, color: `${r?.fg ?? ''}` }}>
                  <span style={{ width: "30px", height: "30px", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", background: `${r?.ab ?? ''}`, color: `${r?.af ?? ''}` }}>
                    {v.tx(r?.i)}
                  </span>
                  {v.tx(r?.n)}
                </button>
              </Fragment>))}
            </div>
          </div>
          {v.locked ? (<>
            <div style={{ padding: "40px", borderRadius: "16px", background: "#fff", border: "1px dashed #D4D4D8", display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.12em", color: "#C2410C" }}>
                {v.t("Demo.nOACCESSINTHISROLE")}
              </span>
              <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.02em" }}>
                {v.t("Demo.thisAreaIsOnlyVisibleTo")}
              </span>
              <span style={{ fontSize: "15px", color: "#52525B" }}>
                {v.t("Demo.youSetRolesOnceTheTeam")}
              </span>
              <button onClick={v.goHome} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "10px 14px", borderRadius: "9999px", border: "none", background: "#0A0A0A", color: "#fff", cursor: "pointer" }}>
                {v.t("Demo.tOOVERVIEW")}
              </button>
            </div>
          </>) : null}
          {v.isHome ? (<>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 18px", padding: "16px 18px 16px 22px", borderRadius: "16px", background: "#0B0B0C", color: "#F5F5F4" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "500", letterSpacing: "0.1em", background: "#FF6A00", color: "#fff", borderRadius: "4px", padding: "3px 7px" }}>
                  {v.t("Demo.aI")}
                </span>
                <span style={{ flex: "1", minWidth: "240px", fontSize: "16px", lineHeight: "1.45" }}>
                  {v.tx(v.brief)}
                </span>
                <button onClick={v.nextBrief} style={{ display: "flex", gap: "10px", alignItems: "center", fontFamily: "var(--font-mono)", fontSize: "11px", padding: "9px 9px 9px 14px", borderRadius: "9999px", border: "1px solid #2A2A2E", background: "transparent", color: "#A1A1AA", cursor: "pointer", whiteSpace: "nowrap", flex: "none" }}>
                  {v.tx(v.briefPos)}
                  <span style={{ width: "26px", height: "26px", borderRadius: "9999px", background: "#F5F5F4", color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>
                    {"▶"}
                  </span>
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "14px" }}>
                {(v.kpis ?? []).map((k, $index) => (<Fragment key={$index}>
                  <div style={{ padding: "22px 24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "#52525B" }}>
                      {v.tx(k?.l)}
                    </span>
                    <span style={{ fontSize: "40px", fontWeight: "700", letterSpacing: "-0.045em", lineHeight: "1" }}>
                      {v.tx(k?.v)}
                    </span>
                    <span style={{ fontSize: "14px", color: `${k?.sc ?? ''}` }}>
                      {v.tx(k?.s)}
                    </span>
                  </div>
                </Fragment>))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "14px", alignItems: "start" }}>
                <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "10px", paddingBottom: "16px", borderBottom: "1px solid #EDEDEB" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                      {v.t("Demo.next7Days")}
                    </span>
                    <div style={{ display: "flex", gap: "14px", fontFamily: "var(--font-mono)", fontSize: "12px", color: "#52525B" }}>
                      {(v.legend ?? []).map((lg, $index) => (<Fragment key={$index}>
                        <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <span style={{ width: "9px", height: "9px", borderRadius: "3px", background: `${lg?.c ?? ''}` }} />
                          {v.tx(lg?.n)}
                        </span>
                      </Fragment>))}
                    </div>
                  </div>
                  {(v.days ?? []).map((dy, $index) => (<Fragment key={$index}>
                    <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: "14px", padding: "13px 0", borderBottom: "1px solid #EDEDEB", alignItems: "start" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "7px" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: "500" }}>
                          {v.tx(dy?.d)}
                        </span>
                        <span style={{ fontSize: "12px", color: "#71717A" }}>
                          {v.tx(dy?.sub)}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {(dy?.ev ?? []).map((e, $index) => (<Fragment key={$index}>
                          <span style={{ display: "flex", gap: "8px", alignItems: "center", maxWidth: "100%", padding: "8px 12px", borderRadius: "10px", background: `${e?.bg ?? ''}`, border: `1px solid ${e?.bd ?? ''}`, fontSize: "14px", fontWeight: "500" }}>
                            <span style={{ width: "7px", height: "7px", flex: "none", borderRadius: "2px", background: `${e?.c ?? ''}` }} />
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#52525B", whiteSpace: "nowrap", flex: "none" }}>
                              {v.tx(e?.t)}
                            </span>
                            <span style={{ minWidth: "0" }}>
                              {v.tx(e?.x)}
                            </span>
                          </span>
                        </Fragment>))}
                      </div>
                    </div>
                  </Fragment>))}
                </div>
                {v.showMoney ? (<>
                  <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                        {v.t("Demo.cashFlow")}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#71717A" }}>
                        {v.t("Demo.n90DAYFORECAST")}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "48px", fontWeight: "700", letterSpacing: "-0.05em", lineHeight: "1" }}>
                        {v.tx(v.d?.liq)}
                      </span>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: `${v.d?.liqC ?? ''}` }}>
                        {v.tx(v.d?.liqD)}
                      </span>
                    </div>
                    <div style={{ height: "120px" }}>
                      {v.tx(v.chart)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {(v.liqRows ?? []).map((a, $index) => (<Fragment key={$index}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "8px 0", borderBottom: "1px solid #F0F0EE" }}>
                          <span style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px", color: "#3F3F46" }}>
                            <span style={{ width: "9px", height: "9px", borderRadius: "2px", background: `${a?.c ?? ''}` }} />
                            {v.tx(a?.n)}
                          </span>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: "500", color: `${a?.vc ?? ''}` }}>
                            {v.tx(a?.v)}
                          </span>
                        </div>
                      </Fragment>))}
                    </div>
                  </div>
                </>) : null}
                {v.hideMoney ? (<>
                  <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                      {v.t("Demo.myTasksToday")}
                    </span>
                    {(v.myTasks ?? []).map((t, $index) => (<Fragment key={$index}>
                      <button onClick={t?.on} style={{ display: "flex", gap: "12px", alignItems: "center", textAlign: "left", padding: "13px 14px", borderRadius: "12px", background: "#FAFAF9", border: "1px solid #EDEDEB", cursor: "pointer", fontFamily: "inherit", minHeight: "48px", color: "#0A0A0A" }}>
                        <span style={{ width: "20px", height: "20px", borderRadius: "6px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", border: `1.5px solid ${t?.bd ?? ''}`, background: `${t?.bg ?? ''}` }}>
                          {v.tx(t?.ck)}
                        </span>
                        <span style={{ fontSize: "15px", color: `${t?.c ?? ''}`, textDecoration: `${t?.td ?? ''}` }}>
                          {v.tx(t?.x)}
                        </span>
                      </button>
                    </Fragment>))}
                  </div>
                </>) : null}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "14px", alignItems: "start" }}>
                <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                      {v.t("Demo.n3ThingsThisWeek")}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#71717A", display: "flex", gap: "6px" }}>
                      <span>
                        {v.tx(v.doneN)}
                      </span>
                      <span>
                        {v.t("Demo.dONE")}
                      </span>
                    </span>
                  </div>
                  {(v.todos ?? []).map((t, $index) => (<Fragment key={$index}>
                    <button onClick={t?.on} style={{ display: "flex", gap: "14px", alignItems: "flex-start", textAlign: "left", padding: "16px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", color: "#0A0A0A", border: `1px solid ${t?.bd ?? ''}`, background: `${t?.bg ?? ''}`, transition: "background .3s" }}>
                      <span style={{ width: "22px", height: "22px", flex: "none", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", border: `1.5px solid ${t?.cb ?? ''}`, background: `${t?.cf ?? ''}` }}>
                        {v.tx(t?.ck)}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1", minWidth: "0" }}>
                        <span style={{ fontSize: "16px", fontWeight: "600", textDecoration: `${t?.td ?? ''}` }}>
                          {v.tx(t?.x)}
                        </span>
                        <span style={{ fontSize: "13px", color: "#52525B" }}>
                          {v.tx(t?.why)}
                        </span>
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontWeight: "500", color: "#C2410C", whiteSpace: "nowrap" }}>
                        {v.tx(t?.g)}
                      </span>
                    </button>
                  </Fragment>))}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", color: "#71717A" }}>
                    {v.t("Demo.nOTHINGHAPPENSWITHOUTYOUROK")}
                  </span>
                </div>
                <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                    {v.t("Demo.goals")}
                  </span>
                  {(v.goals ?? []).map((g, $index) => (<Fragment key={$index}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px 0", borderTop: "1px solid #EDEDEB" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "600" }}>
                          {v.tx(g?.n)}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: "500" }}>
                          {v.tx(g?.p)}
                        </span>
                      </div>
                      <div style={{ height: "8px", borderRadius: "9999px", background: "#EDEDEB", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${g?.w ?? ''}`, borderRadius: "9999px", background: `${g?.c ?? ''}` }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#71717A" }}>
                        <span>
                          {v.tx(g?.s)}
                        </span>
                        <span style={{ color: `${g?.dc ?? ''}` }}>
                          {v.tx(g?.d)}
                        </span>
                      </div>
                    </div>
                  </Fragment>))}
                </div>
              </div>
            </div>
          </>) : null}
          {v.isFin ? (<>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "14px", alignItems: "start" }}>
              <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                    {v.tx(v.d?.revL)}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: "500" }}>
                    {v.tx(v.d?.revSum)}
                  </span>
                </div>
                <div style={{ height: "150px", display: "flex", alignItems: "flex-end", gap: "8px" }}>
                  {(v.rev ?? []).map((w, $index) => (<Fragment key={$index}>
                    <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#71717A" }}>
                        {v.tx(w?.v)}
                      </span>
                      <div style={{ width: "100%", height: `${w?.h ?? ''}`, borderRadius: "4px", background: `${w?.c ?? ''}` }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#71717A" }}>
                        {v.tx(w?.d)}
                      </span>
                    </div>
                  </Fragment>))}
                </div>
                <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em", paddingTop: "8px", borderTop: "1px solid #EDEDEB" }}>
                  {v.t("Demo.costsInOctober")}
                </span>
                {(v.costs ?? []).map((c, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "4px 12px", fontSize: "15px" }}>
                      <span style={{ fontWeight: "600" }}>
                        {v.tx(c?.n)}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", whiteSpace: "nowrap" }}>
                        <span style={{ color: `${c?.vc ?? ''}` }}>
                          {v.tx(c?.v)}
                        </span>
                        <span style={{ color: "#A1A1AA" }}>
                          {" / "}{v.tx(c?.b)}
                        </span>
                      </span>
                    </div>
                    <div style={{ height: "8px", borderRadius: "9999px", background: "#EDEDEB", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${c?.w ?? ''}`, borderRadius: "9999px", background: `${c?.c ?? ''}` }} />
                    </div>
                  </div>
                </Fragment>))}
              </div>
              <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                    {v.t("Demo.openInvoices")}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: "500", color: "#C2410C" }}>
                    {v.tx(v.invSum)}
                  </span>
                </div>
                {(v.invs ?? []).map((iv, $index) => (<Fragment key={$index}>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto auto", gap: "12px", alignItems: "center", padding: "12px 0", borderTop: "1px solid #EDEDEB" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                      <span style={{ fontSize: "15px", fontWeight: "600" }}>
                        {v.tx(iv?.n)}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: `${iv?.dc ?? ''}` }}>
                        {v.tx(iv?.d)}
                      </span>
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                      {v.tx(iv?.a)}
                    </span>
                    <button onClick={iv?.on} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", padding: "8px 11px", borderRadius: "9999px", cursor: "pointer", whiteSpace: "nowrap", border: `1px solid ${iv?.bd ?? ''}`, background: `${iv?.bg ?? ''}`, color: `${iv?.fg ?? ''}` }}>
                      {v.tx(iv?.btn)}
                    </button>
                  </div>
                </Fragment>))}
                <div style={{ marginTop: "6px", padding: "14px 16px", borderRadius: "12px", background: "#FFF4EC", display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "14px" }}>
                  <span>
                    {v.t("Demo.vATReserveQ4")}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: "500" }}>
                    {v.tx(v.d?.vat)}
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", color: "#71717A" }}>
                  {v.t("Demo.eXPORTTOTAXADVISORDATEVMONTHLY")}
                </span>
              </div>
            </div>
          </>) : null}
          {v.isTeam ? (<>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 560px", minWidth: "0", padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "12px", overflowX: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                    {v.tx(v.d?.rotaL)}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", color: "#71717A" }}>
                    {v.t("Demo.wK42")}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "110px repeat(7,minmax(70px,1fr))", gap: "6px", minWidth: "640px" }}>
                  <span />
                  {(v.wkDays ?? []).map((w, $index) => (<Fragment key={$index}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#71717A", textAlign: "center" }}>
                      {v.tx(w)}
                    </span>
                  </Fragment>))}
                  {(v.rota ?? []).map((r, $index) => (<Fragment key={$index}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "1px", alignSelf: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600" }}>
                        {v.tx(r?.n)}
                      </span>
                      <span style={{ fontSize: "11px", color: "#71717A" }}>
                        {v.tx(r?.r)}
                      </span>
                    </span>
                    {(r?.c ?? []).map((c, $index) => (<Fragment key={$index}>
                      <div style={{ height: "54px", borderRadius: "10px", background: `${c?.bg ?? ''}`, color: `${c?.fg ?? ''}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", fontSize: "12px", fontWeight: "600", textAlign: "center", padding: "4px" }}>
                        <span>
                          {v.tx(c?.x)}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "400", opacity: "0.75" }}>
                          {v.tx(c?.t)}
                        </span>
                      </div>
                    </Fragment>))}
                  </Fragment>))}
                </div>
                <span style={{ fontSize: "14px", color: "#52525B" }}>
                  {v.tx(v.d?.rotaNote)}
                </span>
              </div>
              <div style={{ width: "320px", maxWidth: "100%", borderRadius: "34px", background: "#18181B", border: "1px solid #2A2A2E", padding: "11px", flex: "none" }}>
                <div style={{ borderRadius: "25px", background: "#F5F5F4", overflow: "hidden", minHeight: "480px", display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "18px 18px 14px", background: "#0B0B0C", color: "#fff", display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", color: "#FF9A50" }}>
                      {v.t("Demo.tEAMAPPINTHEBROWSER")}
                    </span>
                    <span style={{ fontSize: "19px", fontWeight: "700" }}>
                      {v.t("Demo.hello")}{" "}{v.tx(v.d?.staff)}
                    </span>
                    <span style={{ fontSize: "13px", color: "#A1A1AA" }}>
                      {v.tx(v.d?.staffShift)}
                    </span>
                  </div>
                  <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {v.hasNew ? (<>
                      <div style={{ padding: "11px 13px", borderRadius: "12px", background: "#FFE7D6", border: "1px solid #FFB27A", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", color: "#C2410C" }}>
                          {v.t("Demo.nEWFROMTHEWEBSITE")}
                        </span>
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>
                          {v.tx(v.lastReq)}
                        </span>
                      </div>
                    </>) : null}
                    {(v.myTasks ?? []).map((t, $index) => (<Fragment key={$index}>
                      <button onClick={t?.on} style={{ display: "flex", gap: "12px", alignItems: "center", textAlign: "left", padding: "12px 13px", borderRadius: "12px", background: "#fff", border: "1px solid #E4E4E1", cursor: "pointer", fontFamily: "inherit", minHeight: "46px", color: "#0A0A0A" }}>
                        <span style={{ width: "20px", height: "20px", borderRadius: "6px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#fff", border: `1.5px solid ${t?.bd ?? ''}`, background: `${t?.bg ?? ''}` }}>
                          {v.tx(t?.ck)}
                        </span>
                        <span style={{ fontSize: "14px", color: `${t?.c ?? ''}`, textDecoration: `${t?.td ?? ''}` }}>
                          {v.tx(t?.x)}
                        </span>
                      </button>
                    </Fragment>))}
                  </div>
                </div>
              </div>
            </div>
          </>) : null}
          {v.isKunden ? (<>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "14px", alignItems: "start" }}>
              <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                    {v.tx(v.d?.reqL)}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", color: "#71717A" }}>
                    {v.t("Demo.wEBSITEPHONEEMAIL")}
                  </span>
                </div>
                {(v.reqs ?? []).map((q, $index) => (<Fragment key={$index}>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: "12px", alignItems: "center", padding: "12px 0", borderTop: "1px solid #EDEDEB", background: `${q?.hl ?? ''}`, transition: "background 1.2s" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}>
                      <span style={{ display: "flex", gap: "8px", alignItems: "baseline", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "15px", fontWeight: "600" }}>
                          {v.tx(q?.n)}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", color: `${q?.sc ?? ''}` }}>
                          {v.tx(q?.src)}
                        </span>
                      </span>
                      <span style={{ fontSize: "13px", color: "#52525B" }}>
                        {v.tx(q?.x)}
                      </span>
                    </span>
                    <button onClick={q?.on} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", padding: "8px 11px", borderRadius: "9999px", cursor: "pointer", whiteSpace: "nowrap", border: `1px solid ${q?.bd ?? ''}`, background: `${q?.bg ?? ''}`, color: `${q?.fg ?? ''}` }}>
                      {v.tx(q?.btn)}
                    </button>
                  </div>
                </Fragment>))}
              </div>
              <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                    {v.t("Demo.reviews")}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: "500" }}>
                    {v.tx(v.d?.rating)}
                  </span>
                </div>
                {(v.reviews ?? []).map((rv, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px", borderRadius: "12px", background: "#FAFAF9", border: "1px solid #EDEDEB" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600" }}>
                        {v.tx(rv?.n)}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "#C2410C" }}>
                        {v.tx(rv?.s)}
                      </span>
                    </div>
                    <span style={{ fontSize: "14px", color: "#3F3F46", lineHeight: "1.45" }}>
                      {v.tx(rv?.x)}
                    </span>
                    {rv?.needs ? (<>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", borderRadius: "10px", background: "#fff", border: "1px dashed #FFB27A" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", color: "#C2410C" }}>
                          {v.t("Demo.aIDRAFT")}
                        </span>
                        <span style={{ fontSize: "13px", color: "#3F3F46", lineHeight: "1.45" }}>
                          {v.tx(rv?.draft)}
                        </span>
                        <button onClick={rv?.on} style={{ alignSelf: "flex-end", fontFamily: "var(--font-mono)", fontSize: "10px", padding: "8px 11px", borderRadius: "9999px", border: "none", cursor: "pointer", background: `${rv?.bbg ?? ''}`, color: `${rv?.bfg ?? ''}` }}>
                          {v.tx(rv?.btn)}
                        </button>
                      </div>
                    </>) : null}
                  </div>
                </Fragment>))}
              </div>
            </div>
          </>) : null}
          {v.isLager ? (<>
            <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "6px", maxWidth: "900px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: "8px" }}>
                <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                  {v.tx(v.d?.stockL)}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", color: "#71717A" }}>
                  {v.t("Demo.cOVERAGEUNTILNEXTDELIVERY")}
                </span>
              </div>
              {(v.stock ?? []).map((st, $index) => (<Fragment key={$index}>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr) auto", gap: "16px", alignItems: "center", padding: "12px 0", borderTop: "1px solid #EDEDEB" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                    <span style={{ fontSize: "15px", fontWeight: "600" }}>
                      {v.tx(st?.n)}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: `${st?.dc ?? ''}` }}>
                      {v.tx(st?.d)}
                    </span>
                  </span>
                  <div style={{ height: "8px", borderRadius: "9999px", background: "#EDEDEB", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${st?.w ?? ''}`, borderRadius: "9999px", background: `${st?.c ?? ''}` }} />
                  </div>
                  <button onClick={st?.on} style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", padding: "8px 11px", borderRadius: "9999px", cursor: "pointer", whiteSpace: "nowrap", visibility: `${st?.vis ?? ''}`, border: `1px solid ${st?.bd ?? ''}`, background: `${st?.bg ?? ''}`, color: `${st?.fg ?? ''}` }}>
                    {v.tx(st?.btn)}
                  </button>
                </div>
              </Fragment>))}
            </div>
          </>) : null}
          {v.isWeb ? (<>
            <div style={{ borderRadius: "16px", border: "1px solid #E4E4E1", overflow: "hidden", background: "#fff" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", padding: "10px 14px", background: "#18181B" }}>
                <span style={{ display: "flex", gap: "6px" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "9999px", background: "#3A3A40" }} />
                  <span style={{ width: "10px", height: "10px", borderRadius: "9999px", background: "#3A3A40" }} />
                  <span style={{ width: "10px", height: "10px", borderRadius: "9999px", background: "#3A3A40" }} />
                </span>
                <span style={{ flex: "1", maxWidth: "420px", margin: "0 auto", padding: "6px 12px", borderRadius: "8px", background: "#0B0B0C", fontFamily: "var(--font-mono)", fontSize: "11px", color: "#A1A1AA", textAlign: "center" }}>
                  {v.tx(v.d?.url)}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))" }}>
                <div style={{ padding: "40px 36px", display: "flex", flexDirection: "column", gap: "14px", background: "#F4F1EC" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.12em", color: "#C2410C" }}>
                    {v.tx(v.d?.city)}
                  </span>
                  <span style={{ fontSize: "clamp(30px,3.6vw,44px)", fontWeight: "700", letterSpacing: "-0.04em", lineHeight: "1" }}>
                    {v.tx(v.d?.brand)}
                  </span>
                  <span style={{ fontSize: "16px", lineHeight: "1.55", color: "#52525B" }}>
                    {v.tx(v.d?.claim)}
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {(v.d?.facts ?? []).map((fa, $index) => (<Fragment key={$index}>
                      <span style={{ fontSize: "13px", padding: "7px 12px", borderRadius: "9999px", border: "1px solid #D9D3C9", whiteSpace: "nowrap" }}>
                        {v.tx(fa)}
                      </span>
                    </Fragment>))}
                  </div>
                </div>
                <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <span style={{ fontSize: "20px", fontWeight: "700" }}>
                    {v.tx(v.d?.form)}
                  </span>
                  <input value={v.name ?? ''} onChange={v.setName} placeholder={v.t("Demo.yourName")} style={{ padding: "14px 16px", borderRadius: "10px", border: "1px solid #E4E4E1", fontSize: "15px", outline: "none" }} />
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {(v.slots ?? []).map((sl, $index) => (<Fragment key={$index}>
                      <button onClick={sl?.on} style={{ fontFamily: "var(--font-mono)", fontSize: "12px", padding: "10px 14px", borderRadius: "9999px", cursor: "pointer", whiteSpace: "nowrap", border: `1px solid ${sl?.bd ?? ''}`, background: `${sl?.bg ?? ''}`, color: `${sl?.fg ?? ''}`, whiteSpace: "nowrap" }}>
                        {v.tx(sl?.x)}
                      </button>
                    </Fragment>))}
                  </div>
                  <button onClick={v.submit} style={{ padding: "15px", borderRadius: "9999px", border: "none", background: "#0A0A0A", color: "#fff", fontSize: "15px", fontWeight: "600", cursor: "pointer" }}>
                    {v.tx(v.d?.cta)}
                  </button>
                  {v.sent ? (<>
                    <div style={{ padding: "12px 14px", borderRadius: "10px", background: "#E8F7EE", color: "#14532D", fontSize: "14px", display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
                      <span>
                        {v.t("Demo.sentTheRequestIsNowIn")}
                      </span>
                      <button onClick={v.goKunden} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", padding: "7px 11px", borderRadius: "9999px", border: "1px solid #86EFAC", background: "transparent", color: "#14532D", cursor: "pointer", whiteSpace: "nowrap" }}>
                        {v.t("Demo.vIEW2")}
                      </button>
                    </div>
                  </>) : null}
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", color: "#71717A", paddingTop: "6px" }}>
                    {v.t("Demo.yOUCHANGEOPENINGHOURSANDCOPY")}
                  </span>
                </div>
              </div>
            </div>
          </>) : null}
          {v.isWhat ? (<>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "14px", alignItems: "start" }}>
              <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                  {v.t("Demo.whatIf2")}
                </span>
                <span style={{ fontSize: "14px", color: "#52525B" }}>
                  {v.t("Demo.moveTheSlidersTheCockpitCalculates")}
                </span>
                {(v.sliders ?? []).map((sl, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px 0", borderTop: "1px solid #EDEDEB" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", fontSize: "15px" }}>
                      <span style={{ fontWeight: "600" }}>
                        {v.tx(sl?.n)}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#C2410C", whiteSpace: "nowrap" }}>
                        {v.tx(sl?.v)}
                      </span>
                    </div>
                    <input type="range" min={sl?.min} max={sl?.max} step={sl?.step} value={sl?.val ?? ''} onChange={sl?.on} style={{ width: "100%", accentColor: "#FF6A00" }} />
                  </div>
                </Fragment>))}
              </div>
              <div style={{ padding: "24px", borderRadius: "16px", background: "#0B0B0C", color: "#F5F5F4", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.12em", color: "#FF9A50" }}>
                  {v.t("Demo.rESULT")}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "14px", color: "#A1A1AA" }}>
                    {v.t("Demo.profitPerMonth")}
                  </span>
                  <span style={{ fontSize: "40px", fontWeight: "700", letterSpacing: "-0.04em" }}>
                    {v.tx(v.wi?.p)}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: `${v.wi?.c ?? ''}` }}>
                    {v.tx(v.wi?.dl)}
                  </span>
                </div>
                {(v.wi?.rows ?? []).map((r, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "12px 0", borderTop: "1px solid #26262A", fontSize: "15px" }}>
                    <span>
                      {v.tx(r?.n)}
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: "500", color: `${r?.c ?? ''}` }}>
                      {v.tx(r?.v)}
                    </span>
                  </div>
                </Fragment>))}
                <button onClick={v.wiReset} style={{ alignSelf: "flex-start", fontFamily: "var(--font-mono)", fontSize: "11px", padding: "9px 13px", borderRadius: "9999px", border: "1px solid #2A2A2E", background: "transparent", color: "#A1A1AA", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {v.t("Demo.rESET")}
                </button>
              </div>
            </div>
          </>) : null}
          {v.isData ? (<>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: "14px", alignItems: "start" }}>
              <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: "6px" }}>
                  <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                    {v.t("Demo.connectedSources")}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: "0.1em", color: "#71717A" }}>
                    {v.tx(v.srcOn)}
                  </span>
                </div>
                {(v.srcs ?? []).map((s, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "12px 0", borderTop: "1px solid #EDEDEB" }}>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "15px", fontWeight: "600" }}>
                        {v.tx(s?.n)}
                      </span>
                      <span style={{ fontSize: "12px", color: "#71717A" }}>
                        {v.tx(s?.d)}
                      </span>
                    </span>
                    <button onClick={s?.on} aria-label={s?.n} style={{ width: "46px", height: "26px", flex: "none", borderRadius: "9999px", border: "none", padding: "3px", cursor: "pointer", background: `${s?.bg ?? ''}`, display: "flex", justifyContent: `${s?.jc ?? ''}` }}>
                      <span style={{ width: "20px", height: "20px", borderRadius: "9999px", background: "#fff" }} />
                    </button>
                  </div>
                </Fragment>))}
              </div>
              <div style={{ padding: "24px", borderRadius: "16px", background: "#fff", border: "1px solid #E4E4E1", display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.025em" }}>
                  {v.t("Demo.rolesAndPermissions")}
                </span>
                {(v.perms ?? []).map((p, $index) => (<Fragment key={$index}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "12px 0", borderTop: "1px solid #EDEDEB" }}>
                    <span style={{ fontSize: "15px", fontWeight: "600" }}>
                      {v.tx(p?.n)}
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {(p?.items ?? []).map((it, $index) => (<Fragment key={$index}>
                        <span style={{ fontSize: "12px", padding: "5px 10px", borderRadius: "9999px", background: `${it?.bg ?? ''}`, color: `${it?.fg ?? ''}` }}>
                          {v.tx(it?.x)}
                        </span>
                      </Fragment>))}
                    </div>
                  </div>
                </Fragment>))}
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.08em", color: "#71717A" }}>
                  {v.t("Demo.sERVERSINGERMANYENCRYPTEDGDPRDPA")}
                </span>
              </div>
            </div>
          </>) : null}
        </main>
        {v.ask ? (<>
          <div onClick={v.closeAsk} style={{ position: "fixed", inset: "0", background: "rgba(11,11,12,0.55)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "12vh 20px 20px", zIndex: "20" }}>
            <div onClick={v.stop} style={{ width: "100%", maxWidth: "620px", borderRadius: "18px", background: "#fff", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", overflow: "hidden" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "16px 18px", borderBottom: "1px solid #EDEDEB" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: "500", letterSpacing: "0.1em", background: "#FF6A00", color: "#fff", borderRadius: "4px", padding: "3px 7px" }}>
                  {v.t("Demo.aI")}
                </span>
                <input autoFocus={true} value={v.q ?? ''} onChange={v.qChange} placeholder={v.t("Demo.askYourBusiness")} style={{ flex: "1", border: "none", outline: "none", fontSize: "17px", background: "transparent" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "#71717A" }}>
                  {"ESC"}
                </span>
              </div>
              <div style={{ padding: "10px" }}>
                {(v.sugg ?? []).map((s, $index) => (<Fragment key={$index}>
                  <button onClick={s?.on} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px", textAlign: "left", padding: "12px 14px", borderRadius: "12px", border: "none", background: `${s?.bg ?? ''}`, cursor: "pointer", fontFamily: "inherit", color: "#0A0A0A" }} className="hv-1290a03">
                    <span style={{ fontSize: "15px", fontWeight: "600" }}>
                      {v.tx(s?.q)}
                    </span>
                    {s?.open ? (<>
                      <span style={{ fontSize: "14px", lineHeight: "1.5", color: "#3F3F46" }}>
                        {v.tx(s?.a)}
                      </span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.06em", color: "#71717A" }}>
                        {v.t("Demo.sOURCES")}{" "}{v.tx(s?.src)}
                      </span>
                    </>) : null}
                  </button>
                </Fragment>))}
              </div>
            </div>
          </div>
        </>) : null}
      </div>
    </>
  );
};

const EUR = /^(\s*)([+−-]?)\s?(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d{1,2}))?\s?€(\s*)$/;
const EUR2 = /^(\s*)([+−-]?)€\s?(\d{1,3}(?:\.\d{3})+)(?:,(\d{1,2}))?(\s*)$/;
/**
 * Values computed at runtime (data rows, sums) are German in the demo data.
 * tx() looks the whole string up in the "Demo" messages and, in English,
 * rewrites German euro amounts ("1.234,50 €" → "€1,234.50").
 */
function makeTx(t, locale) {
  return v => {
    if (typeof v !== 'string' || locale === 'de') return v;
    const k = DEMO_KEYS[v.replace(/\s+/g, ' ').trim()];
    if (k) return v.match(/^\s*/)[0] + t('Demo.' + k) + v.match(/\s*$/)[0];
    const m = v.match(EUR) || v.match(EUR2);
    return m ? m[1] + m[2] + '€' + m[3].replace(/\./g, ',') + (m[4] ? '.' + m[4] : '') + m[5] : v;
  };
}

/**
 * Builds the demo data for a locale. Idempotent per locale (same input, same
 * data), so calling it during render is safe; it must run before Logic's
 * class fields read W7 / DN / IND.
 */
function ensureData(t, locale) {
  if (dataLocale === locale) return $tx;
  $t = t;
  $tx = makeTx(t, locale);
  initData();
  dataLocale = locale;
  return $tx;
}

export default function BusinessDemo(props) {
  const dc = useDC();
  const switchLocale = useSwitchLocale();
  const tx = ensureData(dc.t, dc.locale);
  return <Logic key={dc.locale} {...dc} tx={tx} switchLocale={switchLocale} {...props} />;
}
