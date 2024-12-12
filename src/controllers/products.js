import { successResponse, errorResponse } from "../utils/response.handle.js"
import { db } from "../../db/db.js";
import { Product } from "../../db/schema/product.js";
import { eq } from "drizzle-orm";

// const fetchProducts = async (req, res) => {
//   try {
//     let { page = 1, limit = 10 } = req.query;
//     page = Number(page);
//     limit = Number(limit);
//     const offset = (page - 1) * limit;

//     const allProducts = await db.query.Product.findMany({
//       with: {
//         rankings: true,
//       },
//     });

//     const today = new Date().toISOString().split("T")[0];

//     let productsWithTodaysRanking = allProducts
//       .map((product) => {
//         const todaysRanking = product.rankings.find((ranking) => {
//           return ranking.created_at.toISOString().split("T")[0] === today;
//         });
//         return todaysRanking
//           ? {
//               id: product.item_id,
//               title: product.name,
//               url: product.url,
//               todayRanking: todaysRanking.ranking,
//             }
//           : null;
//       })
//       .filter(Boolean);

//     if (productsWithTodaysRanking.length === 0) {
//       const latestDate = allProducts.reduce((latest, product) => {
//         const productLatestDate = product.rankings
//           .map((ranking) => ranking.created_at.toISOString().split("T")[0])
//           .sort()
//           .pop();
//         return productLatestDate > latest ? productLatestDate : latest;
//       }, "");

//       productsWithTodaysRanking = allProducts
//         .map((product) => {
//           const latestRanking = product.rankings.find((ranking) => {
//             return ranking.created_at.toISOString().split("T")[0] === latestDate;
//           });
//           return latestRanking
//             ? {
//                 id: product.item_id,
//                 title: product.name,
//                 url: product.url,
//                 todayRanking: latestRanking.ranking,
//               }
//             : null;
//         })
//         .filter(Boolean);
//     }

//     const sortedProducts = productsWithTodaysRanking.sort(
//       (a, b) => a.todayRanking - b.todayRanking
//     );

//     const paginatedProducts = sortedProducts.slice(offset, offset + limit);
//     const totalCount = sortedProducts.length;
//     const totalPages = Math.ceil(totalCount / limit);

//     const nextPage = page + 1;
//     let nextPageUrl = null;
//     if (nextPage <= totalPages) {
//       const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
//       const queryString = new URLSearchParams({ ...req.query, page: nextPage }).toString();
//       nextPageUrl = `${baseUrl}?${queryString}`;
//     }

//     return successResponse(res, "Products fetched successfully", {
//       products: paginatedProducts,
//       totalCount,
//       totalPages,
//       nextPageUrl,
//     });
//   } catch (error) {
//     return errorResponse(res, error.message, 500);
//   }
// };

const fetchProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;

    const allProducts = await db.query.Product.findMany({
      with: {
        rankings: true,
      },
    });

    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Calculate rankings for the last 30 days
    const productsWithRankings = allProducts.map((product) => {
      const rankingsInLast30Days = product.rankings.filter((ranking) => {
        const rankingDate = new Date(ranking.created_at);
        return rankingDate >= thirtyDaysAgo && rankingDate <= new Date();
      });

      const averageRanking =
        rankingsInLast30Days.reduce((sum, rank) => sum + rank.ranking, 0) /
        (rankingsInLast30Days.length || 1); // Avoid division by 0

      const todaysRanking = product.rankings.find((ranking) => {
        return ranking.created_at.toISOString().split("T")[0] === today;
      });

      return {
        id: product.item_id,
        title: product.name,
        url: product.url,
        todayRanking: todaysRanking ? todaysRanking.ranking : null,
        averageRanking: averageRanking || null,
      };
    });

    // Sort by average ranking (ascending)
    const sortedProducts = productsWithRankings.sort((a, b) => {
      if (a.averageRanking !== b.averageRanking) {
        return a.averageRanking - b.averageRanking;
      }
      return a.todayRanking - b.todayRanking; // Break ties with today's ranking
    });

    // Paginate the results
    const paginatedProducts = sortedProducts.slice(offset, offset + limit);
    const totalCount = sortedProducts.length;
    const totalPages = Math.ceil(totalCount / limit);

    const nextPage = page + 1;
    let nextPageUrl = null;
    if (nextPage <= totalPages) {
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
      const queryString = new URLSearchParams({ ...req.query, page: nextPage }).toString();
      nextPageUrl = `${baseUrl}?${queryString}`;
    }

    return successResponse(res, "Products fetched successfully", {
      products: paginatedProducts,
      totalCount,
      totalPages,
      nextPageUrl,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};




const fetchProductRankings = async (req, res) => {
  try {
    let { page = 1, limit = 10, startDate, endDate } = req.query;
    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;

    const today = new Date();
    endDate = endDate || today.toISOString().split("T")[0];
    startDate = startDate || new Date(today.setDate(today.getDate() - 7)).toISOString().split("T")[0];

    const result = await db.query.Product.findMany({
      with: {
        rankings: true,
      },
    });

    const productsData = result.map((product) => {
      const filteredRankings = product.rankings
        .filter((ranking) => {
          const rankingDate = ranking.created_at.toISOString().split("T")[0];
          return rankingDate >= startDate && rankingDate <= endDate;
        })
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      const data = filteredRankings.map((ranking) => ({
        x: ranking.created_at.toISOString().split("T")[0],
        y: ranking.ranking,
      }));

      return {
        id: product.item_id,
        title: product.name,
        data: data,
        latestRanking: data.length > 0 ? data[data.length - 1].y : null,
      };
    }).filter((product) => product.data.length > 0); 

    const sortedProductsData = productsData.sort(
      (a, b) => (a.latestRanking || Infinity) - (b.latestRanking || Infinity)
    );

    const paginatedProducts = sortedProductsData.slice(offset, offset + limit);
    const totalCount = sortedProductsData.length;
    const totalPages = Math.ceil(totalCount / limit);

    const nextPage = page + 1;
    let nextPageUrl = null;
    if (nextPage <= totalPages) {
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
      const queryString = new URLSearchParams({ ...req.query, page: nextPage }).toString();
      nextPageUrl = `${baseUrl}?${queryString}`;
    }


    return successResponse(res, 'Products fetched successfully', {
      products: paginatedProducts.map(({ latestRanking, ...rest }) => rest),
      totalCount,
      totalPages,
      nextPageUrl,
      startDate,
      endDate
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};


const updateTitle = async (req, res) => {
  try {
    const { productId } = req.params
    const { productName } = req.body
    if (!productName) {
      return errorResponse(res,'New name required!',400)
    }
    const productData = await db.query.Product.findFirst({
      where:eq(Product.item_id, productId)
    })

    if (!productData)
    {
      return errorResponse(res,'Property not found!',404)
    }
    await db.transaction(async (transaction) => {
      const data = await transaction
        .update(Product)
        .set({ name: productName })
        .where(eq(Product.item_id, productId))

      return successResponse(
        res,
        "Property name has been updated successfully!",
        data
      );
    })
  } catch (error) {
    return errorResponse(res,error.message,500)
  }
}



export {
    fetchProducts,
    fetchProductRankings,
    updateTitle
}