const axios = require("axios");
const Teacher = require("../models/Teacher");

const onboardTeacher = async (req, res) => {
    // console.log(req.body)
  const {
    email,
    phone,
    reference_id,
    legal_business_name,
    business_type,
    contact_name,
    category,
    subcategory,
    street1,
    street2,
    city,
    state,
    postal_code,
    country,
    pan,
    gst,
    account_number,
    ifsc_code,
  } = req.body;

  try {
    const linkedAccountResponse = await axios.post(
      "https://api.razorpay.com/v2/accounts",
      {
        email,
        phone,
        type: "route",
        legal_business_name,
        business_type,
        profile: {
          category,
          subcategory,
          addresses: {
            registered: {
              street1,
              street2,
              city,
              state,
              postal_code,
              country,
            },
          },
        },
        legal_info: {
          pan,
          gst,
        },
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    const account_id = linkedAccountResponse.data.id; 
    console.log("Linked Account Response:", linkedAccountResponse.data);

    // console.log("Reached here")

    // const stakeholderResponse = await axios.post(
    //   `https://api.razorpay.com/v2/accounts/${account_id}/stakeholders`,
    //   {
    //     name: contact_name,
    //     email,
    //     addresses: {
    //       residential: {
    //         street: street1,
    //         city,
    //         state,
    //         postal_code,
    //         country,
    //       },
    //     },
    //     kyc: {
    //       pan: "AVOPB1111K",
    //     },
    //     notes: {
    //       random_key_by_partner: "random_value",
    //     },
    //   },
    //   {
    //     auth: {
    //       username: process.env.RAZORPAY_KEY_ID,
    //       password: process.env.RAZORPAY_KEY_SECRET,
    //     },
    //   }
    // );
    

    const productConfigResponse = await axios.post(
      `https://api.razorpay.com/v2/accounts/${account_id}/products`,
      {
        product_name: "route",
        tnc_accepted: true,
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    // console.log("Reached here too")
    // console.log(productConfigResponse.data.id)
    const product_id = productConfigResponse.data.id
    const updateConfigResponse = await axios.patch(
      `https://api.razorpay.com/v2/accounts/${account_id}/products/${product_id}`,
      {
        settlements: {
          account_number,
          ifsc_code,
          beneficiary_name: contact_name,
        },
        tnc_accepted: true,
      },
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    // console.log("Reached here too wow")

    const teacher = await Teacher.create({
      name: contact_name,
      email,
      contact: phone,
      razorpayAccountId: account_id,
    });

    // console.log("Reached here too wow wow")

    res.status(201).json({
      message: "Teacher onboarded successfully",
      teacher,
      linkedAccount: linkedAccountResponse.data,
      // stakeholder: stakeholderResponse.data,
      productConfig: productConfigResponse.data,
      updateConfig: updateConfigResponse.data,
    });
  } catch (error) {
    console.error("Error onboarding teacher:", error.response ? error.response.data : error.message);
    res.status(500).json({
      message: "Failed to onboard teacher",
      error: error.response ? error.response.data : error.message,
    });
  }
};

module.exports = { onboardTeacher };