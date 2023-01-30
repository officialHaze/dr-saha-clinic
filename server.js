require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));

app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.set("view engine", "ejs");

const port = 5000;

mongoose.set("strictQuery", false);
mongoose.connect(
	`mongodb+srv://admin-moinak:${process.env.MONGO_DB_ATLAS_PASSWORD}@clusterv2.g2smmdo.mongodb.net/sahaBlogDB`,
	{
		useNewUrlParser: true,
	}
);

const genericBlogSchema = {
	category: String,
	image: String,
	title: String,
	body: String,
	date: String,
	comments: [
		{
			name: String,
			website: String,
			email: String,
			text: String,
			postingDate: String,
			postingTime: String,
		},
	],
};

const doctorSpeaksSchema = {
	category: String,
	image: String,
	title: String,
	body: String,
	date: String,
	comments: [
		{
			name: String,
			website: String,
			email: String,
			text: String,
			postingDate: String,
			postingTime: String,
		},
	],
};

const onlinePatientSchema = {
	firstname: {
		required: true,
		type: String,
	},
	lastname: {
		required: true,
		type: String,
	},
	phone: {
		required: true,
		type: Number,
	},
	email: {
		required: true,
		type: String,
	},
	bookingdate: {
		required: true,
		type: String,
	},
	bookingtime: {
		required: true,
		type: String,
	},
};

const offlinePatientSchema = {
	firstname: {
		required: true,
		type: String,
	},
	lastname: {
		required: true,
		type: String,
	},
	phone: {
		required: true,
		type: Number,
	},
	email: {
		required: true,
		type: String,
	},
	bookingdate: {
		required: true,
		type: String,
	},
	bookingtime: {
		required: true,
		type: String,
	},
};

const messageSchema = {
	name: {
		required: true,
		type: String,
	},
	phone: {
		required: true,
		type: Number,
	},
	message: {
		required: true,
		type: String,
	},
};

const GenericBlog = mongoose.model("GenericBlog", genericBlogSchema);
const DoctorSpeak = mongoose.model("DoctorSpeak", doctorSpeaksSchema);
const OnlinePatient = mongoose.model("OnlinePatient", onlinePatientSchema);
const OfflinePatient = mongoose.model("OfflinePatient", offlinePatientSchema);
const Message = mongoose.model("Message", messageSchema);

let post;
let finalPost;
let title;
let category;
let firstName;
let lastName;
let date;
let email;
let phoneNum;
let bookingDate;
let bookingTime;

app.listen(process.env.PORT || port, (req, res) => {
	console.log(`Server running on port ${port}`);
});

app.get("/", async (req, res) => {
	const resp = await getGenericData();

	res.render("index", {
		datas: resp,
	});
});

app.get("/generic", async (req, res) => {
	const resp = await getGenericData();
	res.render("blog", {
		type: "generic",
		datas: resp,
	});
});

app.get("/doctorspeaks", async (req, res) => {
	const resp = await getDoctorSpeaksData();
	res.render("blog", {
		type: "doctorSpeaks",
		datas: resp,
	});
});

app.get("/blog/post/:param", async (req, res) => {
	const parameter = req.params.param;
	const paramLower = parameter.toLowerCase();

	const comments = await getComments(title);

	const genericPosts = await getGenericData();

	if (paramLower == finalPost) {
		res.render("post", {
			title: title,
			category: category,
			date: date,
			comments: comments,
			genericPosts: genericPosts,
		});
	}
});

app.get("/composeblogtemplate", (req, res) => {
	res.render("composeTemplate");
});

app.get("/about", (req, res) => {
	res.render("exceptHome", {
		pageType: "about",
	});
});

app.get("/homeopathy", (req, res) => {
	res.render("exceptHome", {
		pageType: "homeopathy",
	});
});

app.get("/photos", (req, res) => {
	res.render("exceptHome", {
		pageType: "check-us",
		page: "images",
	});
});

app.get("/media", (req, res) => {
	res.render("exceptHome", {
		pageType: "media",
	});
});

app.get("/videos", (req, res) => {
	res.render("exceptHome", {
		pageType: "check-us",
		page: "videos",
	});
});

app.get("/treatment/:param", (req, res) => {
	const path = req.params.param;
	switch (path) {
		case "hairloss":
			res.render("exceptHome", {
				pageType: "treatment",
				page: "hairloss",
			});
			break;

		case "hairregrowth":
			res.render("exceptHome", {
				pageType: "treatment",
				page: "hairregrowth",
			});
			break;

		case "malesexual":
			res.render("exceptHome", {
				pageType: "treatment",
				page: "malesexual",
			});
			break;

		case "gastrictrouble":
			res.render("exceptHome", {
				pageType: "treatment",
				page: "gastrictrouble",
			});
			break;

		case "pcos":
			res.render("exceptHome", {
				pageType: "treatment",
				page: "pcos",
			});
			break;

		default:
			break;
	}
});

app.get("/appointmentbooking", (req, res) => {
	res.render("bookApt", {
		pageType: "book-online",
		status: "fill-details",
	});
});

app.get("/bookingtime", async (req, res) => {
	const patientDatas = [];
	const patientDatasArray = await getPatientData(date, patientDatas);
	const modifiedDate = new Date(date);
	const dateNew = modifiedDate.toLocaleDateString("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
	});
	res.render("bookApt", {
		fName: firstName,
		lName: lastName,
		email: email,
		phoneNo: phoneNum,
		prefDate: dateNew,
		dateCheck: date,
		pageType: "book-online",
		status: "select-time",
		patientDetails: patientDatasArray,
	});
});

app.get("/bookingconfirmedoffline", (req, res) => {
	res.render("bookingStatus", {
		status: "confirmedoffline",
		name: firstName,
	});
});

app.get("/bookingconfirmedonline", (req, res) => {
	res.render("bookingStatus", {
		status: "confirmedonline",
		name: firstName,
	});
});

app.get("/patientexists", (req, res) => {
	res.render("bookingStatus", {
		status: "patient-exists",
		bookingdate: bookingDate,
		bookingtime: bookingTime,
	});
});

app.get("/bookingexists/:param", (req, res) => {
	const path = req.params.param;
	if (path == "completepayment") {
		res.render("bookingStatus", {
			status: "complete-payment",
		});
	} else {
		console.log(`error 404`);
	}
});

app.get("/contact", (req, res) => {
	res.render("exceptHome", {
		pageType: "contact",
	});
});

app.get("/message-sent", (req, res) => {
	res.render("bookingStatus", {
		status: "message-sent",
	});
});

app.get("/error", (req, res) => {
	res.render("bookingStatus", {
		status: "failed",
	});
});

app.get("/bookings-online", async (req, res) => {
	const onlinePatients = await getOnlinePatients();
	res.render("bookings", {
		patients: onlinePatients,
		type: "online",
	});
});

app.get("/bookings-offline", async (req, res) => {
	const offlinePatients = await getOfflinePatients();
	res.render("bookings", {
		patients: offlinePatients,
		type: "offline",
	});
});

app.post("/", async (req, res) => {
	try {
		const destination = await req.body.page;

		switch (destination) {
			case "home":
				res.redirect("/");
				break;

			case "blogGeneric":
				res.redirect("/generic");
				break;

			case "blogDoctorSpeaks":
				res.redirect("/doctorspeaks");
				break;

			case "about":
				res.redirect("/about");
				break;

			case "homeopathy":
				res.redirect("/homeopathy");
				break;

			case "images":
				res.redirect("/photos");
				break;

			case "videos":
				res.redirect("/videos");
				break;

			case "media":
				res.redirect("/media");
				break;

			case "bookOnline":
				res.redirect("/appointmentbooking");
				break;

			case "contact":
				res.redirect("/contact");
				break;

			default:
				break;
		}
	} catch (err) {
		console.log(err);
	}
});

app.post("/blog", async (req, res) => {
	post = req.body.blogPost;

	const datasGeneric = await getGenericData();
	const datasDoctorSpeaks = await getDoctorSpeaksData();

	title = await getTitle(datasGeneric, datasDoctorSpeaks, post);
	category = await getCategory(datasGeneric, datasDoctorSpeaks, post);
	date = await getDate(datasGeneric, datasDoctorSpeaks, post);

	const withoutQuestionMark = title.replace("?", "");
	const titleFreeOfSplChar = withoutQuestionMark.replace(":", "");
	finalPost = titleFreeOfSplChar.toLowerCase();

	res.redirect(`/blog/post/${finalPost}`);
});

app.post("/blog-redirect", async (req, res) => {
	title = req.body.title;
	category = await getCategoryByTitle(title);
	date = await getDateByTitle(title);

	const withoutQuestionMark = title.replace("?", "");
	const titleFreeOfSplChar = withoutQuestionMark.replace(":", "");
	finalPost = titleFreeOfSplChar.toLowerCase();

	res.redirect(`/blog/post/${finalPost}`);
});

app.post("/compose", (req, res) => {
	const bImg = req.body.blogImg;
	const bTitle = req.body.blogTitle;
	const bBody = req.body.blogBody;
	const bDate = req.body.blogDate;
	const publish = req.body.publishWhere;

	if (publish == "generic") {
		saveDataGeneric(bImg, bTitle, bBody, bDate, res);
	} else if (publish == "doctorspeaks") {
		saveDataDoctorSpeaks(bImg, bTitle, bBody, bDate, res);
	}
});

app.post("/apptbook", async (req, res) => {
	const dateValue = new Date(req.body.date);
	firstName = req.body.fName;
	lastName = req.body.lName;
	phoneNum = req.body.phoneNumber;
	email = req.body.eMail;

	date = dateValue.toLocaleDateString("en-US");

	res.redirect("/bookingtime");
});

app.post("/timeset", async (req, res) => {
	try {
		const bookingType = req.body.bookingType;
		const timeValue = req.body.time;
		const idxOfcolon = timeValue.indexOf(":");
		const hourString = timeValue.substring(0, idxOfcolon);
		const minuteString = timeValue.substring(idxOfcolon + 1, timeValue.length);

		const hourInt = parseInt(hourString);
		let time;
		if (hourInt > 12) {
			const convert = hourInt - 12;
			const actualHour = String(convert);
			time = actualHour + ":" + minuteString + " PM";
		} else if (hourInt < 12) {
			time = hourString + ":" + minuteString + " AM";
		} else if (hourInt == 12) {
			time = "12:" + minuteString + " PM";
		}

		if (bookingType == "online") {
			const exists = await checkforExistingOnlinePatient(phoneNum);
			if (exists) {
				bookingDate = await getOnlineExistingPatientBookingDate(phoneNum);
				bookingTime = await getOnlineExistingPatientBookingTime(phoneNum);
				res.redirect("/patientexists");
			} else if (!exists) {
				const resp = await savePatientOnline(time, firstName, lastName, date, email, phoneNum);
				console.log(`patient booked online ${resp}`);
				res.redirect("/bookingconfirmedonline");
			}
		} else if (bookingType == "offline") {
			const exists = await checkforExistingOfflinePatient(phoneNum);
			if (exists) {
				bookingDate = await getOfflineExistingPatientBookingDate(phoneNum);
				bookingTime = await getOfflineExistingPatientBookingTime(phoneNum);
				res.redirect("/patientexists");
			} else if (!exists) {
				const resp = await savePatientOffline(time, firstName, lastName, date, email, phoneNum);
				console.log(`patient booked offline ${resp}`);
				res.redirect("/bookingconfirmedoffline");
			}
		}
	} catch (err) {
		console.log(err);
		res.redirect("/error");
	}
});

app.post("/comments", async (req, res) => {
	try {
		const commentorName = req.body.commentorname;
		const commentorEmail = req.body.commentoremail;
		const commentorWebsite = req.body.commentorwebsite;
		const comment = req.body.comment;
		const title = req.body.title;
		const date = new Date();
		const postingDate = date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
		const postingTime = date.toLocaleTimeString("en-US");

		const resp = await uploadComment(
			commentorName,
			commentorEmail,
			commentorWebsite,
			comment,
			title,
			postingDate,
			postingTime
		);

		console.log(resp);

		const withoutQuestionMark = title.replace("?", "");
		const titleFreeOfSplChar = withoutQuestionMark.replace(":", "");
		finalPost = titleFreeOfSplChar.toLowerCase();

		res.redirect(`/blog/post/${finalPost}`);
	} catch (err) {
		console.log(err);
	}
});

app.post("/message", async (req, res) => {
	const name = req.body.messengerName;
	const phone = req.body.messengerPhone;
	const message = req.body.message;
	try {
		const messageSaved = await saveMessage(name, phone, message);
		console.log(`Message Saved ${messageSaved}`);
		res.redirect("/message-sent");
	} catch (err) {
		console.log(err);
		res.redirect("/error");
	}
});

async function getGenericData() {
	try {
		return await GenericBlog.find({});
	} catch (err) {
		console.log(err);
	}
}

async function getDoctorSpeaksData() {
	try {
		return await DoctorSpeak.find({});
	} catch (err) {
		console.log(err);
	}
}

async function saveDataGeneric(bImg, bTitle, bBody, bDate, res) {
	try {
		const newBlog = new GenericBlog({
			image: bImg,
			title: bTitle,
			body: bBody,
			date: bDate,
		});

		await newBlog.save();

		res.redirect("/generic");
	} catch (err) {
		console.log(err);
	}
}

async function saveDataDoctorSpeaks(bImg, bTitle, bBody, bDate, res) {
	try {
		const newBlog = new DoctorSpeak({
			image: bImg,
			title: bTitle,
			body: bBody,
			date: bDate,
		});

		await newBlog.save();

		res.redirect("/doctorspeaks");
	} catch (err) {
		console.log(err);
	}
}

function getTitle(datasGeneric, datasDoctorSpeaks, post) {
	return new Promise((resolve) => {
		datasGeneric.forEach((data) => {
			const title = data.title;
			const idxOfFirstSpace = title.indexOf(" ");
			if (idxOfFirstSpace != -1) {
				const firstWordOfData = title.substring(0, idxOfFirstSpace);
				if (firstWordOfData == post) {
					resolve(title);
				}
			} else {
				resolve(title);
			}
		});
		datasDoctorSpeaks.forEach((data) => {
			const title = data.title;
			const idxOfFirstSpace = title.indexOf(" ");
			if (idxOfFirstSpace != -1) {
				const firstWordOfData = title.substring(0, idxOfFirstSpace);
				if (firstWordOfData == post) {
					resolve(title);
				}
			} else {
				if (title == post) {
					resolve(title);
				}
			}
		});
	});
}

function getCategory(datasGeneric, datasDoctorSpeaks, post) {
	return new Promise((resolve) => {
		datasGeneric.forEach((data) => {
			const category = data.category;
			const title = data.title;
			const idxOfFirstSpace = title.indexOf(" ");
			if (idxOfFirstSpace != -1) {
				const firstWordOfData = title.substring(0, idxOfFirstSpace);
				if (firstWordOfData == post) {
					resolve(category);
				}
			} else {
				resolve(category);
			}
		});
		datasDoctorSpeaks.forEach((data) => {
			const category = data.category;
			const title = data.title;
			const idxOfFirstSpace = title.indexOf(" ");
			if (idxOfFirstSpace != -1) {
				const firstWordOfData = title.substring(0, idxOfFirstSpace);
				if (firstWordOfData == post) {
					resolve(category);
				}
			} else {
				resolve(category);
			}
		});
	});
}

function getDate(datasGeneric, datasDoctorSpeaks, post) {
	return new Promise((resolve) => {
		datasGeneric.forEach((data) => {
			const date = data.date;
			const title = data.title;
			const idxOfFirstSpace = title.indexOf(" ");
			if (idxOfFirstSpace != -1) {
				const firstWordOfData = title.substring(0, idxOfFirstSpace);
				if (firstWordOfData == post) {
					resolve(date);
				}
			} else {
				resolve(date);
			}
		});
		datasDoctorSpeaks.forEach((data) => {
			const date = data.date;
			const title = data.title;
			const idxOfFirstSpace = title.indexOf(" ");
			if (idxOfFirstSpace != -1) {
				const firstWordOfData = title.substring(0, idxOfFirstSpace);
				if (firstWordOfData == post) {
					resolve(date);
				}
			} else {
				resolve(date);
			}
		});
	});
}

function getPatientData(date, patientDatas) {
	return new Promise(async (resolve, reject) => {
		try {
			const onlinePatientDetails = await OnlinePatient.find({});
			onlinePatientDetails.forEach((patient) => {
				if (patient.bookingdate == date) {
					patientDatas.push(patient);
				}
			});
			const offlinePatientDetails = await OfflinePatient.find({});
			offlinePatientDetails.forEach((patient) => {
				if (patient.bookingdate == date) {
					patientDatas.push(patient);
				}
			});
			resolve(patientDatas);
		} catch (err) {
			console.log(err.message);
			reject(err.message);
		}
	});
}

async function checkforExistingOnlinePatient(phoneNum) {
	try {
		const exists = false;
		const onlinePatientDetails = await OnlinePatient.find({});
		onlinePatientDetails.forEach((patient) => {
			if (patient.phone == phoneNum) {
				exists = true;
			}
			return exists;
		});
	} catch (err) {
		return err;
	}
}

async function checkforExistingOfflinePatient(phoneNum) {
	try {
		const exists = false;
		const offlinePatientDetails = await OfflinePatient.find({});
		offlinePatientDetails.forEach((patient) => {
			if (patient.phone == phoneNum) {
				exists = true;
			}
			return exists;
		});
	} catch (err) {
		return err;
	}
}

async function getOnlineExistingPatientBookingDate(phoneNum) {
	const patient = await OnlinePatient.findOne({ phone: phoneNum });
	const bookingDate = patient.bookingdate;
	return bookingDate;
}

async function getOnlineExistingPatientBookingTime(phoneNum) {
	const patient = await OnlinePatient.findOne({ phone: phoneNum });
	const bookingTime = patient.bookingtime;
	return bookingTime;
}

async function getOfflineExistingPatientBookingDate(phoneNum) {
	const patient = await OfflinePatient.findOne({ phone: phoneNum });
	const bookingDate = patient.bookingdate;
	return bookingDate;
}

async function getOfflineExistingPatientBookingTime(phoneNum) {
	const patient = await OfflinePatient.findOne({ phone: phoneNum });
	const bookingTime = patient.bookingtime;
	return bookingTime;
}

function savePatientOnline(time, firstName, lastName, date, email, phoneNum) {
	return new Promise(async (resolve, reject) => {
		const newPatient = new OnlinePatient({
			firstname: firstName,
			lastname: lastName,
			phone: phoneNum,
			email: email,
			bookingdate: date,
			bookingtime: time,
		});

		try {
			const saved = await newPatient.save();
			resolve(saved);
		} catch (err) {
			reject(err);
		}
	});
}

function savePatientOffline(time, firstName, lastName, date, email, phoneNum) {
	return new Promise(async (resolve, reject) => {
		const newPatient = new OfflinePatient({
			firstname: firstName,
			lastname: lastName,
			phone: phoneNum,
			email: email,
			bookingdate: date,
			bookingtime: time,
		});

		try {
			const saved = await newPatient.save();
			resolve(saved);
		} catch (err) {
			reject(err);
		}
	});
}

async function uploadComment(
	commentorName,
	commentorEmail,
	commentorWebsite,
	comment,
	title,
	postingDate,
	postingTime
) {
	try {
		let dataCategory;
		const genericDatas = await GenericBlog.find({});
		const doctorSpeaksDatas = await DoctorSpeak.find({});

		genericDatas.forEach((data) => {
			if (data.title == title) {
				dataCategory = data.category;
			}
		});

		doctorSpeaksDatas.forEach((data) => {
			if (data.title == title) {
				dataCategory = data.category;
			}
		});

		if (dataCategory == "Generic") {
			const result = await GenericBlog.findOneAndUpdate(
				{ title: title },
				{
					$push: {
						comments: {
							name: commentorName,
							website: commentorWebsite,
							email: commentorEmail,
							text: comment,
							postingDate: postingDate,
							postingTime: postingTime,
						},
					},
				}
			);
			return `Comment updated ${result}`;
		} else if (dataCategory == "Doctor Speaks") {
			const result = await DoctorSpeak.findOneAndUpdate(
				{ title: title },
				{
					$push: {
						comments: {
							name: commentorName,
							website: commentorWebsite,
							email: commentorEmail,
							text: comment,
							postingDate: postingDate,
							postingTime: postingTime,
						},
					},
				}
			);
			return `Comment updated ${result}`;
		}
	} catch (err) {
		return err;
	}
}

async function getComments(title) {
	return new Promise(async (resolve, reject) => {
		try {
			const data = await GenericBlog.findOne({ title: title });

			if (data != null) {
				const comments = data.comments;
				resolve(comments);
			} else {
				const data = await DoctorSpeak.findOne({ title: title });
				if (data != null) {
					const comments = data.comments;
					resolve(comments);
				}
			}
		} catch (err) {
			reject(err);
		}
	});
}

function getCategoryByTitle(title) {
	return new Promise(async (resolve, reject) => {
		try {
			const genericPost = await GenericBlog.findOne({ title: title });

			const category = genericPost.category;
			resolve(category);
		} catch (err) {
			reject(err);
		}
	});
}

function getDateByTitle(title) {
	return new Promise(async (resolve, reject) => {
		try {
			const genericPost = await GenericBlog.findOne({ title: title });

			const date = genericPost.date;
			resolve(date);
		} catch (err) {
			reject(err);
		}
	});
}

function saveMessage(name, phone, message) {
	return new Promise(async (resolve, reject) => {
		const messageData = new Message({
			name: name,
			phone: phone,
			message: message,
		});
		try {
			const result = await messageData.save();
			resolve(result);
		} catch (err) {
			reject(err.message);
		}
	});
}

async function getOnlinePatients() {
	try {
		const patients = await OnlinePatient.find({});
		return patients;
	} catch (err) {
		return err;
	}
}

async function getOfflinePatients() {
	try {
		const patients = await OfflinePatient.find({});
		return patients;
	} catch (err) {
		return err;
	}
}
