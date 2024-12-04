import { Product, productRelations } from "./product"
import { ProductRanking, productRankingRelations } from "./productRanking"

const schema = [
    Product,
    productRelations,
    ProductRanking,
    productRankingRelations
]

export default schema