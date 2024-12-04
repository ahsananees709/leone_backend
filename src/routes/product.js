import express from 'express';
import { fetchProducts, fetchProductRankings, updateTitle } from '../controllers/products.js';

const router = express.Router();


router.get(
    '/products',
    fetchProducts
);

router.get(
    '/products-rankings',
    fetchProductRankings
);

router.patch(
    '/:productId',
    updateTitle
);

export default router;
