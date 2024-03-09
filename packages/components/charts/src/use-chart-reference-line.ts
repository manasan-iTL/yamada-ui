import { getCSS, useTheme } from "@yamada-ui/core"
import type { CSSUIObject } from "@yamada-ui/core"
import type { Dict } from "@yamada-ui/utils"
import { isObject, cx } from "@yamada-ui/utils"
import { useCallback, useMemo } from "react"

import type { ReferenceLineProps } from "recharts"

import type {
  ReferenceLineUIProps,
  RequiredChartPropGetter,
} from "./chart.types"
import { referenceLineProperties } from "./chart.types"
import { getProps } from "./utils"

export type UseChartReferenceLineOptions = {
  /**
   * Reference lines that should be displayed on the chart.
   */
  referenceLineProps?: ReferenceLineUIProps[]
}

type UseChartReferenceLineProps = UseChartReferenceLineOptions & {
  styles: Dict<CSSUIObject>
}

export const useChartReferenceLine = ({
  referenceLineProps = [],
  styles,
}: UseChartReferenceLineProps) => {
  const { theme } = useTheme()
  const styleClassName = getCSS(styles.referenceLine)(theme)
  const propList = useMemo(
    () =>
      referenceLineProps.map((props, index) => {
        const [{ label: _label, ...rest }, propClassName] = getProps(
          [props, referenceLineProperties],
          styleClassName,
        )(theme)
        const color = `var(--ui-reference-line-${index})`
        const label: ReferenceLineProps["label"] = {
          value: _label as string,
          fill: color,
          position: "insideBottomLeft",
          ...(isObject(_label) ? _label : {}),
        }

        return { propClassName, color, label, ...rest }
      }),
    [referenceLineProps, styleClassName, theme],
  )

  const getReferenceLineProps: RequiredChartPropGetter<
    "div",
    {
      index: number
    },
    Omit<ReferenceLineProps, "ref">
  > = useCallback(
    ({ index, className, ...props }, ref = null) => {
      const { propClassName, color, label, ...rest } = propList[index]

      return {
        ref,
        className: cx(className, propClassName),
        stroke: color,
        label,
        ...(props as ReferenceLineProps),
        ...rest,
      }
    },
    [propList],
  )

  return { getReferenceLineProps }
}
