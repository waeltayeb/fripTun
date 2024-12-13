
export const useArticalData = () => {
    const artical = [
        {
            id: 1,
            title: "Artical 1",
            description: "Artical 1 description",
            imageUrl: ["product1.jpg", "product2.jpg", "product3.jpg"],
            price: 100,
            newprice: 50,
            etat: "New",
            category: "Category 1",
            brand: {name: "Brand 1"},
            instock: true,
            recomended: true,
            size: "S",

        },
        {
            id: 2,
            title: "Artical 2",
            description: "Artical 2 description",
            imageUrl: ["product1.jpg", "product2.jpg", "product3.jpg"],
            price: 200,
            newprice: 100,
            etat: "New",
            category: "Category 2",
            brand: {name: "Brand 2"},
            instock: true,
            recomended: true, 
            size: "M",
        },
        {
            id: 3,
            title: "Artical 3",
            description: "Artical 3 description",
            imageUrl: ["product1.jpg", "product2.jpg", "product3.jpg"],
            price: 300,
            newprice: 150,
            etat: "bien",
            category: "Category 3",
            brand: {name: "Brand 3"},
            instock: true,
            recomended: true,
            size: "L",
        },
        {
            id: 4,
            title: "Artical 4",
            description: "Artical 4 description",
            imageUrl: ["product1.jpg", "product2.jpg", "product3.jpg"],
            price: 400,
            newprice: 0,
            etat: "bon état",
            category: "Category 4",
            brand: {name: "Brand 4"},
            instock: true,
            recomended: true,
            size: "XL",
        },

    ];
    const Brand = [
        {
            id: 1,
            name: "Brand 1",
            imageUrl: "brand1.jpg",
        },
        {
            id: 2,
            name: "Brand 2",
            imageUrl: "brand2.jpg",
        },
        {
            id: 3,
            name: "Brand 3",
            imageUrl: "brand3.jpg",
        },
        {
            id: 4,
            name: "Brand 4",
            imageUrl: "brand4.jpg",
        },
        {
            id: 5,
            name: "Brand 5",
            imageUrl: "brand5.jpg",
        },
        {
            id: 6,
            name: "Brand 6",
            imageUrl: "brand6.jpg",
        },
        {
            id: 7,
            name: "Brand 7",
            imageUrl: "brand7.jpg",
        },
        {
            id: 8,
            name: "Brand 8",
            imageUrL: "brand8.jpg",
        },
    ];
    
    return { artical, Brand };
}
