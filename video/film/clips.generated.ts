// Üretildi: tools/extractClips.mjs. Elle düzenlenmez.
export const CLIPS = {
  "admin": {
    "frames": 372,
    "marks": {
      "lead": 0.7,
      "dialog": 3.433,
      "payment": 5.9,
      "open": 9.133,
      "link": 10.1
    }
  },
  "apply": {
    "frames": 529,
    "marks": {
      "company": 0.5,
      "contact": 2.767,
      "message": 10.533,
      "submit": 14.8,
      "sent": 15.633
    }
  },
  "landing": {
    "frames": 243,
    "marks": {
      "hero": 1.6,
      "to-pricing": 2.533,
      "pricing": 3.7,
      "choose": 5.933,
      "apply": 6.9
    }
  },
  "rollcall": {
    "frames": 389,
    "marks": {
      "ali": 0.9,
      "emre": 3.1,
      "hasan": 5.267,
      "murat": 7.467,
      "done": 10.667
    }
  },
  "setup": {
    "frames": 632,
    "marks": {
      "company": 0.9,
      "owner": 3.933,
      "site": 11.4,
      "summary": 17,
      "finish": 18.1,
      "workspace": 18.867
    }
  },
  "sites": {
    "frames": 906,
    "marks": {
      "list": 0.7,
      "chat": 2.167,
      "media": 3.867,
      "typing": 7.767,
      "photo": 11.5,
      "sent": 15.667,
      "to-field": 19.1,
      "field": 22.733,
      "field-scroll": 25.3
    }
  }
} as const

export type ClipName = keyof typeof CLIPS
