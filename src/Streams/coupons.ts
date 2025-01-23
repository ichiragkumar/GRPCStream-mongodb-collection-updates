// import { CouponUpdateRequest } from "../../generated/product/CouponUpdateRequest";
// import { CouponUpdateResponse } from "../../generated/product/CouponUpdateResponse";
// import BusinessDetails from "../../models/BusinessDetails";
// import Coupon from "../../models/coupon";
// import * as grpc from "@grpc/grpc-js";

// export async function streamCouponUpdates(
//     call: grpc.ServerWritableStream<CouponUpdateRequest, CouponUpdateResponse>
//   ) {
//     const { businessId, couponCode } = call.request; // Extract businessId and code from the request
  
//     try {
//       console.log(`streamCouponUpdates started for businessId: ${businessId}, code: ${code}`);
  
//       // Watch the `Coupon` collection, filtering for the specified businessId and code
//       const changeStream: any = Coupon.watch([
//         {
//           $match: {
//             "fullDocument.businessId": businessId,
//             "fullDocument.code": couponCode,
//           },
//         },
//       ]);
  
//       changeStream.on("change", async (change: any) => {
//         console.log("Change detected for specific businessId and code:", change);
  
//         if (change.operationType === "update") {
//           // Retrieve the updated coupon
//           const updatedCoupon = await Coupon.findById(change.documentKey._id);
//           if (!updatedCoupon) {
//             console.error("Could not find the updated coupon");
//             return;
//           }
  
//           // Fetch the corresponding business details
//           const business = await BusinessDetails.findOne({ id: updatedCoupon.businessId });
//           if (!business) {
//             console.error("Could not find business details");
//             return;
//           }
  
//           // Create and send the response
//           const response: CouponUpdateResponse = {
//             type: "UPDATED",
//             couponCode: updatedCoupon.code,
//             businessId: updatedCoupon.businessId,
//             status: updatedCoupon.status,
//             expiryDate: updatedCoupon.expiry.toISOString(),
//             totalCoupons: business.numbers,
//             remainingCoupons: business.left,
//             businessName: business.name,
//             message: `Coupon updated for ${business.name}`,
//           };
  
//           console.log("Emitting updated coupon details:", response);
//           call.write(response);
//         }
//       });
  
//       // Handle stream cancellation
//       call.on("cancelled", () => {
//         console.log("Stream cancelled, closing change stream");
//         changeStream.close();
//       });
  
//       // Handle stream errors
//       call.on("error", (error) => {
//         console.error("Stream error:", error.message);
//         changeStream.close();
//       });
//     } catch (error) {
//       console.error("Error in streamCouponUpdates:", error);
//     }
//   }