export const PHOTO_URl_BUSINESS_USER = (data) => {
    const url = {
      A: "/assets/images/A.png",
      AA: "/assets/images/AA.png",
      AN: "/assets/images/AN.png",
      B: "/assets/images/B.png",
      C: "/assets/images/c.png",
      NR: "/assets/images/NR.png",
    }
    if (data === 'A') {
      return url.A
    }
    else if (data === 'AA') {
      return url.AA
    }
    else if (data === 'AN') {
      return url.AN
    }
    else if (data === 'B') {
      return url.B
    }
    else if (data === 'C') {
      return url.C
    }
    else if (data === 'NR') {
      return url.NR
    } else {
      return '/assets/images/poor_credit_score.svg'
    }
  }

  export const PHOTO_URl_PERSONAL_USER = (data) => {
    const url = {
      1_20: "/assets/images/1-20.png",
      21_29: "/assets/images/21-29.png",
      30_50: "/assets/images/30-50.png",
      51_70: "/assets/images/51-70.png",
      71_100: "/assets/images/71-100.png"
    }
    if (0 < data && data <= 20) {
      return url[1_20]
    }
    else if (21 < data && data <= 29) {
      return url[21_29]
    }
    else if (30 < data && data <= 50) {
      return url[30_50]
    }
    else if (51 < data && data <= 70) {
      return url[51_70]
    }
    else if (71 < data && data <= 100) {
      return url[71_100]
    } else {
      return '/assets/images/poor_credit_score.svg'
    }
  }