import {useEffect, useState} from "react";
import {getAllBaseDataVariety, getAllProductByFilterParameter, getAllProducts} from "@lib/api";
import defaultStyles from "../stylesheet/global.module.css"
import boosterPageStyles from "../stylesheet/boostersPage.module.css"
import ProductArticle from "@components/views/ProductCollectionItem";
import {useRouter} from "next/router";
import {Accordion, Col, Container, Form, Row, Stack} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {getAvgStarRating, getDiscountPrice, isEventNowWithBoolean} from "@components/Utils";

export default function BoostersPage({session, host}) {

    const usages = [
        {name: "Gaming", checked: false, count: 0},
        {name: "Office", checked: false, count: 0},
        {name: "Students & Pupils", checked: false, count: 0}
    ]

    const sortOptions = [
        {name: "Relevance", option: 0},
        {name: "Stock amount", option: 1},
        {name: "Lowest Price", option: 2},
        {name: "Hightest Price", option: 3},
        {name: "Rating", option: 4}
    ]

    const [products, setProducts] = useState([])
    const [filterProductName, setFilterProductName] = useState("")
    const [varietyList, setVarietyList] = useState([])
    const [usageList, setUsageList] = useState(usages)
    const [selectedSortOption, setSelectedSortOption] = useState(0)
    const [filterVariety, setFilterVariety] = useState([])
    const [filterUsage, setFilterUsage] = useState([])
    const [filteredProduct, setFilteredProduct] = useState([])
    const router = useRouter()

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await getAllProductByFilterParameter(host, "active=true&_embed=productReviews")
                console.log(products)
                setProducts(products)
                setFilteredProduct(products)
                createFilterListByUsage(products)
            } catch (e) {
                console.log(e)
            }
        }
        loadProducts()
    }, [host])

    useEffect(() => {
        const loadVarieties = async () => {
            try {
                const varieties = await getAllBaseDataVariety(host)
                setVarietyList(varieties.filter(v => v.numbersIncludedProducts > 0).map(v => {
                    return {name: v.name, count: v.numbersIncludedProducts, checked: false}
                }))
            } catch (e) {
                console.log(e)
            }
        }
        loadVarieties()
    }, [host])

    useEffect(() => {
        filterProducts()
    }, [varietyList, usageList, filterProductName, selectedSortOption])

    const handleSelectVarieties = (e, name) => {
        const newState = varietyList.map(item => {
            if (item.name === name) {
                return {...item, checked: e.target.checked}
            }
            return item
        })
        setVarietyList(newState)
        setFilterVariety(newState.filter(s => s.checked))
    }

    const handleSelectUsage = (e, name) => {
        const newState = usageList.map(item => {
            if (item.name === name) {
                return {...item, checked: e.target.checked}
            }
            return item
        })
        setUsageList(newState)
        setFilterUsage(newState.filter(s => s.checked))
    }

    const filterProducts = () => {
        let productsToFilter
        productsToFilter = products.filter(p => p.name.toString().includes(filterProductName))
        if (filterVariety.length > 0) {
            let varietyStr = "p => "
            for (let i = 0; i < filterVariety.length; i++) {
                varietyStr = varietyStr + "p.varieties.includes(\"" + filterVariety[i].name + "\")"
                if (i !== filterVariety.length - 1) {
                    varietyStr = varietyStr + " || "
                }
            }
            productsToFilter = productsToFilter.filter(eval(varietyStr))
        }
        if (filterUsage.length > 0) {
            let usageStr = "p => "
            for (let i = 0; i < filterUsage.length; i++) {
                usageStr = usageStr + "p.usage.toString() === \"" + filterUsage[i].name + "\""
                if (i !== filterUsage.length - 1) {
                    usageStr = usageStr + " || "
                }
            }
            productsToFilter = productsToFilter.filter(eval(usageStr))
        }
        const finalFilteredAndSorted = selectedSortOption === 0 ? sortProducts(filteredProduct) : filteredProduct
        setFilteredProduct(finalFilteredAndSorted)
    }

    const sortProducts = (productsAfterFiltered) => {
        let p = productsAfterFiltered
        switch (selectedSortOption) {
            case 0:
                break
            case 1:
                p = p.sort((a, b) => parseInt(b.stockAmount) - parseInt(a.stockAmount))
                break;
            case 2:
                p = p.sort((a, b) =>
                    parseFloat(isEventNowWithBoolean(b.discountFrom, b.discountUntil, b.discountActive) ?
                        getDiscountPrice(b.price, b.discountPercent) :
                        b.price) -
                    parseFloat(isEventNowWithBoolean(a.discountFrom, a.discountUntil, a.discountActive) ?
                        getDiscountPrice(a.price, a.discountPercent)
                        : a.price)
                )
                break;
            case 3:
                p = p.sort((a, b) =>
                    parseFloat(isEventNowWithBoolean(a.discountFrom, a.discountUntil, a.discountActive) ?
                        getDiscountPrice(a.price, a.discountPercent)
                        : a.price) -
                    parseFloat(isEventNowWithBoolean(b.discountFrom, b.discountUntil, b.discountActive) ?
                        getDiscountPrice(b.price, b.discountPercent) :
                        b.price)
                )
                break;
            case 4:
                p = p.sort((a, b) => getAvgStarRating(b?.productReviews) - getAvgStarRating(a?.productReviews))
                break;
        }
        return p
    }

    function createFilterListByUsage(products) {
        const listToAddCount = usageList
        for (let i = 0; i < listToAddCount.length; i++) {
            listToAddCount[i].count = products.filter(p => p.usage === listToAddCount[i].name).length
        }
        setUsageList(listToAddCount.filter(u => u.count > 0))
    }

    return (
        <div className={defaultStyles.page}>
            <Container fluid={true} className={defaultStyles.pageContentGap15}>
                <Row>
                    <Col md={12}>
                        <h1 className={`${defaultStyles.pageTitle}`}>All boosters in assortment</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form.Select className={defaultStyles.dropDownFilter} style={{marginLeft: "auto", marginRight: 10}} value={selectedSortOption} onChange={(e) => setSelectedSortOption(e.target.selectedIndex)}>
                            {
                                sortOptions.map((opt) => {
                                    return (
                                        <option key={opt.option} value={opt.option}>{opt.name}</option>
                                    )
                                })
                            }
                        </Form.Select>
                    </Col>
                </Row>
                <Row>
                    <Col xxl={3} lg={4} md={4} sm={12} xs={12}>
                        <h2 className={defaultStyles.pageSubtitle}>Filter</h2>
                        <div className={defaultStyles.formSubtitleSeparatorLine}/>
                        <Accordion>
                            <Accordion.Item eventKey={"0"} className={`${defaultStyles.accordionItem}`}>
                                <Accordion.Header className={`${defaultStyles.accordionHeaderTransparent} ${defaultStyles.accordionHeader} ${boosterPageStyles.filterTitle}`}>Filter by Variety:</Accordion.Header>
                                <Accordion.Body className={defaultStyles.accordionBody}>
                                    <Stack gap={2}>
                                        {
                                            varietyList.map((v, index) => {
                                                return (
                                                    <Stack direction={"horizontal"} key={index} className={boosterPageStyles.filterListElement}>
                                                        <Form.Check defaultChecked={v.checked} className={defaultStyles.formCheckbox} onChange={(e) => handleSelectVarieties(e, v.name)}/>
                                                        <p>{v.name}</p>
                                                        <p className={"ms-auto"}>{v.count}</p>
                                                    </Stack>
                                                )
                                            })
                                        }
                                    </Stack>
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey={"1"} className={`${defaultStyles.accordionItem}`}>
                                <Accordion.Header className={`${defaultStyles.accordionHeaderTransparent} ${defaultStyles.accordionHeader}`}>Filter by Usage</Accordion.Header>
                                <Accordion.Body className={defaultStyles.accordionBody}>
                                    <Stack gap={2}>
                                        {
                                            usageList.map((u, index) => {
                                                return (
                                                    <Stack direction={"horizontal"} key={index} className={boosterPageStyles.filterListElement}>
                                                        <Form.Check defaultChecked={u.checked} className={defaultStyles.formCheckbox} onChange={(e) => handleSelectUsage(e, u.name)}/>
                                                        <p>{u.name}</p>
                                                        <p className={"ms-auto"}>{u.count}</p>
                                                    </Stack>
                                                )
                                            })
                                        }
                                    </Stack>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                    <Col xxl={9} lg={8} md={8} sm={12} xs={12}>
                        <Container fluid={true}>
                            {/*
                            <Row>
                                <Col>
                                    <div className={`${defaultStyles.flexHorizontal} ${boosterPageStyles.searchBar}`}>
                                        <p className={defaultStyles.formLabel}>Search:</p>
                                        <Form.Control className={defaultStyles.filterInputField} onChange={(e) => setFilterProductName(e.target.value)}/>
                                        <FontAwesomeIcon icon={faMagnifyingGlass} size={"lg"} color={"white"}/>
                                    </div>

                                </Col>
                            </Row>
                            */}
                            <Row className={boosterPageStyles.collections}>
                                {
                                    filteredProduct.map((article, index) => {
                                        return (
                                            // eslint-disable-next-line react/jsx-key
                                            <Col key={index} xs={12} sm={6} md={6} xl={4} className={`${defaultStyles.margin24Bottom}`}>
                                                <ProductArticle session={session} product={article} routeToDetail={() => router.push(`./boosters/${article.id}/`)} showAll={true}/>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Container>

                    </Col>
                </Row>
            </Container>
        </div>
    )

}