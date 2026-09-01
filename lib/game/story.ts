import { Story } from "./types";

export const promStory: Story = {
  id: "ridgeview-prom-1987",
  title: "The Ridgeview Prom Night",
  year: "1987",
  setup:
    "Ridgeview High, May 22nd, 1987. Poppy Halloran left her house at 5:45pm to walk the six blocks to the Whitfield house for pre-prom photos. Her date, her friends, and both sets of parents were waiting on the Whitfields' front lawn with three cameras and a limo booked for 6:30. She never arrived. Twelve hours later a jogger found her prom corsage crushed on the shoulder of Culvert Road, a half mile off her route. Read the evidence. Question the timeline. Crack the case.",
  characters: [
    {
      id: "poppy",
      name: "Poppy Halloran",
      role: "The victim — Ridgeview High senior",
      description:
        "Class treasurer, works weekends at the Dairy Freeze, on the prom queen ballot. Dating Jake Sorensen. Best friends with Amy Whitfield and Traci Nguyen since third grade.",
      isSuspect: false,
    },
    {
      id: "jake",
      name: "Jake Sorensen",
      role: "Poppy's boyfriend & prom date",
      description:
        "Point guard for the Ridgeview Rams. Was at the Whitfield house from 5:50pm on, waiting with everyone else.",
      isSuspect: true,
    },
    {
      id: "amy",
      name: "Amy Whitfield",
      role: "Poppy's best friend — also on the prom queen ballot",
      description:
        "Hosted photos at her house because her parents have the big front lawn and her dad likes to film everything on his new camcorder. Also up for prom queen tonight.",
      isSuspect: true,
    },
    {
      id: "denise",
      name: "Denise Whitfield",
      role: "Amy's mother, hosting parent",
      description:
        "Ridgeview High class of '63 — and 1963's prom queen, a fact she brings up often. Spent the afternoon 'getting everything ready' for the parents' after-photos get-together.",
      isSuspect: true,
    },
    {
      id: "frank",
      name: "Frank Whitfield",
      role: "Amy's father, hosting parent",
      description:
        "Sells insurance, just bought the family a Prodigy home computer service subscription and won't stop talking about it. Manned the camcorder on the lawn all evening.",
      isSuspect: true,
    },
    {
      id: "traci",
      name: "Traci Nguyen",
      role: "Poppy's other best friend",
      description: "Yearbook photo editor. Arrived at the Whitfields' at 5:55pm with Marcus.",
      isSuspect: true,
    },
    {
      id: "marcus",
      name: "Marcus Webb",
      role: "Traci's date",
      description: "Works with Jake at the Amoco station on weekends. Drove Traci over himself.",
      isSuspect: true,
    },
    {
      id: "ben",
      name: "Ben Cole",
      role: "Amy's date",
      description: "New to Ridgeview this year, transferred in January. Doesn't know Poppy well.",
      isSuspect: true,
    },
    {
      id: "carol",
      name: "Carol Halloran",
      role: "Poppy's mother",
      description:
        "Took photos of Poppy alone in the driveway before she left for the Whitfields'. Arrived at the Whitfields' at 6:15pm with Richard, expecting Poppy to already be there.",
      isSuspect: false,
    },
    {
      id: "richard",
      name: "Richard Halloran",
      role: "Poppy's father",
      description: "Split the limo cost with the Whitfields over the Prodigy mail service that week.",
      isSuspect: false,
    },
    {
      id: "lou",
      name: "Lou Griggs",
      role: "Limo driver, Griggs Livery",
      description: "Booked for 6:30pm pickup at the Whitfield house. Arrived on time and waited.",
      isSuspect: false,
    },
  ],
  evidence: [
    {
      id: "email-dresses",
      category: "correspondence",
      title: "\"PROM SQUAD 87\" — Message Thread",
      subtitle: "Poppy, Amy & Traci — printed from the Prodigy service, May 18th",
      date: "May 18, 1987 — 8:41pm",
      thread: [
        { from: "Poppy H.", time: "8:41pm", text: "ok the dress is HEMMED. Mrs. Alvarez did the beading by hand I could cry" },
        { from: "Traci N.", time: "8:44pm", text: "SCREAMING mine came in today too, the shoes are a full inch too big but its fine im wearing 2 pairs of socks lol" },
        { from: "Amy W.", time: "8:47pm", text: "you guys my mom is already rearranging the living room furniture for pictures. she has been planning the \"photo wall\" since March" },
        { from: "Poppy H.", time: "8:52pm", text: "ok not to jinx anything but... i kind of really hope i win queen tonight 👑😭 dont hate me" },
        { from: "Amy W.", time: "8:53pm", text: "omg no jinxing!! but also lol same, i mean i wouldnt be mad if i won either. my mom won in 63 and she NEVER lets us forget it, it would mean so much to her if i did too" },
        { from: "Traci N.", time: "8:55pm", text: "you're both gonna win something calm down 😂 see you guys at my house at 5:30 tmrw for hair" },
      ],
    },
    {
      id: "email-jake",
      category: "correspondence",
      title: "Message Thread — Jake",
      subtitle: "Poppy & Jake Sorensen, printed from the Prodigy service, May 21st",
      date: "May 21, 1987 — 9:12pm",
      thread: [
        { from: "Jake S.", time: "9:12pm", text: "hey what time am i supposed to be at the whitfields tmrw" },
        { from: "Poppy H.", time: "9:15pm", text: "photos start at 6, limo comes at 6:30. dont forget the boutonniere, its in the fridge at the flower shop under your name" },
        { from: "Jake S.", time: "9:16pm", text: "got it. corsage is the peach one right, matches your dress" },
        { from: "Poppy H.", time: "9:17pm", text: "yes!! ok i have to finish my nails. i'm leaving my house around 5:45 to walk over, dont be late mr sorensen" },
        { from: "Jake S.", time: "9:19pm", text: "i wont. see you tomorrow 🙂" },
      ],
    },
    {
      id: "email-parents",
      category: "correspondence",
      title: "Message Thread — The Parents",
      subtitle: "Carol Halloran & Denise Whitfield, printed from the Prodigy service, May 19th",
      date: "May 19, 1987 — 2:03pm",
      thread: [
        { from: "Carol H.", time: "2:03pm", text: "Denise, Richard spoke to Lou at Griggs Livery, the limo for the six of them comes to $95 for the evening, split down the middle that's $47.50 each. Does that work?" },
        { from: "Denise W.", time: "2:20pm", text: "That's fine, I'll have Frank write the check. Are we still doing drinks for the grown-ups after the photos? I can pick up potato skins from Rusty's on my way back from the beauty parlor, and I make a wonderful cosmopolitan if I do say so myself." },
        { from: "Carol H.", time: "2:25pm", text: "That sounds lovely. Richard is bringing the good camera so let's get everyone on the lawn by 6 sharp before the light goes." },
        { from: "Denise W.", time: "2:31pm", text: "Perfect. I already told Amy that lawn is MINE for the evening, ha! See you both tomorrow." },
      ],
    },
    {
      id: "email-whereisshe",
      category: "correspondence",
      title: "Message Thread — \"where is she??\"",
      subtitle: "Group thread, printed the following morning",
      date: "May 22, 1987 — 6:04pm to 6:52pm",
      thread: [
        { from: "Amy W.", time: "6:04pm", text: "is poppy with anyone? she's not here yet" },
        { from: "Traci N.", time: "6:11pm", text: "no i thought she left her house already?? jake are you at the whitfields" },
        { from: "Jake S.", time: "6:15pm", text: "yeah been here since 550, no sign of her. tried calling her house, no answer" },
        { from: "Marcus W.", time: "6:22pm", text: "amy's mom seems kind of frazzled lol, she keeps going in and out checking the driveway" },
        { from: "Ben C.", time: "6:30pm", text: "limo guy is here, he's just waiting in the driveway" },
        { from: "Amy W.", time: "6:41pm", text: "my mom just got back from running an errand and still no poppy. this isnt like her at all" },
        { from: "Jake S.", time: "6:52pm", text: "poppys parents just pulled up, poppys mom is freaking out, we're calling the police" },
      ],
    },
    {
      id: "photo-driveway",
      category: "photograph",
      title: "Driveway Photos, No Poppy",
      subtitle: "Taken by Richard Halloran on the Whitfields' front lawn, 6:38pm",
      date: "May 22, 1987 — 6:38pm",
      photo: {
        scene: "driveway",
        caption:
          "Five of the six kids pose stiffly on the Whitfields' lawn, gap where Poppy should be. In the background, the Whitfield family Buick sits at an odd angle in the driveway, nose-out instead of backed in like usual — as if it had just been pulled back in a hurry. The plate is partially visible: OH • 4J-71??.",
        note: "Denise Whitfield is not in this photo. Frank says she'd 'just stepped inside.'",
      },
    },
    {
      id: "photo-porch",
      category: "photograph",
      title: "Poppy, Alone in Her Dress",
      subtitle: "Taken by Carol Halloran on the Hallorans' front porch, 5:40pm",
      date: "May 22, 1987 — 5:40pm",
      photo: {
        scene: "porch",
        caption:
          "Poppy on her own front steps in a peach chiffon gown, corsage box in hand, grinning at the camera. Carol wrote the time on the back in pen: '5:40 — five minutes before she left to walk to Amy's! So beautiful.'",
      },
    },
    {
      id: "photo-trafficcam",
      category: "photograph",
      title: "Elm & 4th Traffic Camera — Sequential Frames",
      subtitle: "Ridgeview PD intersection camera, released to investigators",
      date: "May 22, 1987 — 5:49pm to 5:52pm",
      photo: {
        scene: "traffic-cam",
        caption:
          "Grainy black-and-white stills, one every ninety seconds. Frame 1 (5:49pm): Poppy walking north on 4th, dress unmistakable even in grainy film. Frame 2 (5:50:30pm): Poppy continues walking; a station wagon is visible half a block behind her, paused at the stop sign on Elm. Frame 3 (5:52pm): Poppy is gone from frame — nowhere on the sidewalk. The station wagon is also gone.",
        note: "Elm & 4th is two blocks off Poppy's direct route to the Whitfields' — and directly on the road to Rusty's Pub & Grub.",
      },
    },
    {
      id: "photo-crimescene",
      category: "photograph",
      title: "Culvert Road — Scene Photos",
      subtitle: "Taken by Ridgeview PD the following morning",
      date: "May 23, 1987 — 7:15am",
      photo: {
        scene: "crime-scene",
        caption:
          "Poppy's peach boutonniere box, crushed flat, in the gravel on the shoulder of Culvert Road. A few feet away, a single faint tire track curves off the asphalt onto the shoulder and back — the tread pattern consistent with a full-size wagon tire, not a compact car.",
      },
    },
    {
      id: "photo-promphotos",
      category: "photograph",
      title: "Prom Photos, Later That Night",
      subtitle: "Taken by Frank Whitfield's camcorder, after the search began",
      date: "May 22, 1987 — 9:10pm",
      photo: {
        scene: "prom-photo",
        caption:
          "A few grim frames of the remaining kids and parents in the Whitfield living room, nobody smiling, waiting on word from the search party. On the side table behind them: a full plate of potato skins, mostly untouched, and a pitcher of pink liquid with a lime wedge on the rim.",
        note: "Denise told police she 'never left the kitchen all evening' and 'didn't have time to make anything special' once Poppy went missing.",
      },
    },
    {
      id: "transcript-denise",
      category: "transcript",
      title: "Interrogation — Denise Whitfield",
      subtitle: "Amy's mother, hosting parent",
      date: "May 24, 1987",
      transcript: {
        subject: "Denise Whitfield",
        interviewer: "Det. R. Okafor, Ridgeview PD",
        lines: [
          { speaker: "Okafor", text: "Walk me through your afternoon, Mrs. Whitfield." },
          { speaker: "Denise", text: "I was in and out of the kitchen all afternoon getting things ready for after the photos. I never really left the house." },
          { speaker: "Okafor", text: "Never left the house at all, between noon and when Poppy was expected?" },
          { speaker: "Denise", text: "That's right. I had far too much to do. Amy can tell you, I was a whirlwind in that kitchen." },
          { speaker: "Okafor", text: "And the car in your driveway in the 6:38 photo — Richard Halloran's photo shows it parked at an angle, like it had just pulled in." },
          { speaker: "Denise", text: "I'm sure I don't know what you mean. Frank moves that car around the driveway all the time." },
          { speaker: "Okafor", text: "One more thing. Frank mentioned you 'stepped out' around six. Where did you go?" },
          { speaker: "Denise", text: "I really don't remember stepping out. It was such a chaotic evening, Detective, everyone was frantic. I'd like to stop for today." },
        ],
      },
    },
    {
      id: "transcript-frank",
      category: "transcript",
      title: "Interrogation — Frank Whitfield",
      subtitle: "Amy's father, hosting parent",
      date: "May 24, 1987",
      transcript: {
        subject: "Frank Whitfield",
        interviewer: "Det. R. Okafor, Ridgeview PD",
        lines: [
          { speaker: "Okafor", text: "Where were you between five and six-thirty?" },
          { speaker: "Frank", text: "On the front lawn the whole time, filming with my new camcorder. Got the whole thing on tape, actually, if you want it." },
          { speaker: "Okafor", text: "We'll take that. And your wife?" },
          { speaker: "Frank", text: "In and out. She popped out around six to grab a few things for after — she does that, she likes everything to be perfect for company." },
          { speaker: "Okafor", text: "Grab a few things — from where?" },
          { speaker: "Frank", text: "I assumed Rusty's, that's where she always gets those potato skins. She wasn't gone long. Fifteen, twenty minutes, tops." },
        ],
      },
    },
    {
      id: "transcript-amy",
      category: "transcript",
      title: "Interrogation — Amy Whitfield",
      subtitle: "Poppy's best friend",
      date: "May 24, 1987",
      transcript: {
        subject: "Amy Whitfield",
        interviewer: "Det. R. Okafor, Ridgeview PD",
        lines: [
          { speaker: "Okafor", text: "How was Poppy seeming this week, anything unusual?" },
          { speaker: "Amy", text: "No, she was just excited. We all were. I keep thinking about our messages from Monday, we were just talking about dresses." },
          { speaker: "Okafor", text: "And your mother, that evening?" },
          { speaker: "Amy", text: "She was really stressed about hosting, more than usual. She snapped at me for messing up the food table right before everyone got there. Then she disappeared for a bit and came back kind of pale, but she gets like that when she's stressed hosting." },
          { speaker: "Okafor", text: "Do you know where she went?" },
          { speaker: "Amy", text: "I figured the store. I don't know, I was busy getting my hair right." },
        ],
      },
    },
    {
      id: "transcript-jake",
      category: "transcript",
      title: "Interrogation — Jake Sorensen",
      subtitle: "Poppy's boyfriend",
      date: "May 24, 1987",
      transcript: {
        subject: "Jake Sorensen",
        interviewer: "Det. R. Okafor, Ridgeview PD",
        lines: [
          { speaker: "Okafor", text: "What time did you get to the Whitfields'?" },
          { speaker: "Jake", text: "5:50, maybe a couple minutes before. I have three witnesses, we were all just standing around waiting." },
          { speaker: "Okafor", text: "Did you leave at any point?" },
          { speaker: "Jake", text: "No, never. I was there the whole time, ask anybody. I keep thinking if I'd walked over and met her partway none of this would've happened." },
        ],
      },
    },
    {
      id: "transcript-traci",
      category: "transcript",
      title: "Interrogation — Traci Nguyen",
      subtitle: "Poppy's best friend",
      date: "May 24, 1987",
      transcript: {
        subject: "Traci Nguyen",
        interviewer: "Det. R. Okafor, Ridgeview PD",
        lines: [
          { speaker: "Okafor", text: "Anything odd about the Whitfield house that evening?" },
          { speaker: "Traci", text: "Mrs. Whitfield seemed really on edge, more than a hosting-a-party kind of on edge. She kept checking the driveway. And when she came back from wherever she went, her hands were shaking pouring the drinks later. I didn't think anything of it at the time." },
        ],
      },
    },
    {
      id: "transcript-marcus",
      category: "transcript",
      title: "Interrogation — Marcus Webb",
      subtitle: "Traci's date",
      date: "May 24, 1987",
      transcript: {
        subject: "Marcus Webb",
        interviewer: "Det. R. Okafor, Ridgeview PD",
        lines: [
          { speaker: "Okafor", text: "Where were you the whole evening?" },
          { speaker: "Marcus", text: "Whitfields' driveway, with Jake and Ben, waiting on the girls to finish getting ready. Nothing unusual until Poppy didn't show." },
        ],
      },
    },
    {
      id: "transcript-ben",
      category: "transcript",
      title: "Interrogation — Ben Cole",
      subtitle: "Amy's date",
      date: "May 24, 1987",
      transcript: {
        subject: "Ben Cole",
        interviewer: "Det. R. Okafor, Ridgeview PD",
        lines: [
          { speaker: "Okafor", text: "You're new to Ridgeview — did you know Poppy well?" },
          { speaker: "Ben", text: "Not really, only through Amy. I mostly just remember Mrs. Whitfield seemed stressed all night, but I figured that's just what moms are like hosting stuff like this." },
        ],
      },
    },
    {
      id: "transcript-lou",
      category: "transcript",
      title: "Interrogation — Lou Griggs",
      subtitle: "Limo driver, Griggs Livery",
      date: "May 24, 1987",
      transcript: {
        subject: "Lou Griggs",
        interviewer: "Det. R. Okafor, Ridgeview PD",
        lines: [
          { speaker: "Okafor", text: "What time did you arrive at the Whitfield house?" },
          { speaker: "Lou", text: "6:25, right on schedule. Sat in that driveway near an hour before anybody said a word to me about what was going on." },
          { speaker: "Okafor", text: "Notice anything odd?" },
          { speaker: "Lou", text: "Just that the lady of the house wasn't around when I first pulled up. She came out to apologize for the wait maybe ten minutes after I got there." },
        ],
      },
    },
    {
      id: "transcript-hallorans",
      category: "transcript",
      title: "Interrogation — Carol & Richard Halloran",
      subtitle: "Poppy's parents",
      date: "May 24, 1987",
      transcript: {
        subject: "Carol & Richard Halloran",
        interviewer: "Det. R. Okafor, Ridgeview PD",
        lines: [
          { speaker: "Carol", text: "She left our house at 5:45 sharp, I have the photo timestamped. It's a fifteen minute walk to the Whitfields', she'd done it a hundred times." },
          { speaker: "Richard", text: "We got there at 6:15 to help set up for the limo and she still wasn't there. Denise seemed distracted when she let us in, kept saying it wasn't like Poppy to be late." },
        ],
      },
    },
  ],
  solutionCharacterId: "denise",
  solutionSummary:
    "It was Denise Whitfield. She left the house around 5:48 to pick up potato skins from Rusty's — and passed Poppy walking up 4th Street. Denise had just overheard, in the group thread the parents didn't know the kids could see, that Poppy hoped to win prom queen — the one title Denise still measured her own daughter against. In a moment of blind jealousy on Poppy's behalf of a crown that hadn't even been awarded yet, Denise swerved onto the shoulder as she passed her, striking Poppy and killing her. She panicked, drove on to Rusty's as if nothing happened to establish her alibi, came home, plated the potato skins she'd already bought, and told police she'd never left the kitchen. The station wagon in the traffic-cam frame, the tire track at the crime scene, the potato skins in the background of the prom photos she claimed she 'didn't have time' to make, and her own contradicted alibi all place her on Culvert Road at 5:50pm — two minutes after Poppy was last seen alive.",
};
