import {Col, Container, Row} from "react-bootstrap";
import defaultStyles from "../../pages/stylesheet/global.module.css"
import productReviewItemStyles from "./ProductReviewItem.module.css"
import formatTimestamp from "@components/Utils";
import ReactStars from "react-stars/dist/react-stars";

export default function ProductReviewItem({session, review}) {
    return (
        <div>
            <Container fluid={true} className={productReviewItemStyles.container}>
                <Row>
                    <Col className={defaultStyles.disableColumnPaddings}>
                        <ReactStars count={5} color2={"#FFB800"} value={review.starRate} half={true} edit={false} size={32}/>
                    </Col>
                    <Col className={defaultStyles.alignmentCenter}>
                        <p style={{marginLeft: "auto"}} className={productReviewItemStyles.reviewDate}>{session.user && review.user.id === session.user.id ? "By you" : "From " + review.user.firstName + " " + review.user.lastName} on {formatTimestamp(review.reviewDate, "dd.MMMM.yyyy HH:mm")}</p>
                    </Col>
                </Row>
                <Row>
                    <Col className={defaultStyles.disableColumnPaddings}>
                        <h3>{review.title}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col className={defaultStyles.disableColumnPaddings}>
                        <p>{review.text}</p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}