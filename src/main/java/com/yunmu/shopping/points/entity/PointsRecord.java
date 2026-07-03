package com.yunmu.shopping.points.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.yunmu.shopping.common.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("points_record")
public class PointsRecord extends BaseEntity {

    private static final long serialVersionUID = 1L;

    private Long id;

    private Long userId;

    private String recordNo;

    private Integer type;

    private Integer points;

    private Integer beforePoints;

    private Integer afterPoints;

    private String description;

    private Long orderId;

    private String orderNo;

    private Integer status;

}
