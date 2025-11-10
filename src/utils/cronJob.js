const cronJob = require("node-cron");
const dateFns = require("date-fns");

const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cronJob.schedule("0 5 * * *", async () => {
  try {
    const yesterday = dataFns.subDays(new Date(), 1);
    const yesterdayStart = dateFns.startOfDay(yesterday);
    const yesterdayEnd = dateFns.endOfDay(yesterday);

    const pendingReqsuests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingReqsuests.map((req) => req.toUserId.emailid)),
    ];

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "Pending connection requests " + email,
          `You have pending connection requests. Please check your account.`,
          email
        );
        console.log("Email sent successfully ", res);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log("cron job error ", error);
  }
});
