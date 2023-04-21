import * as Audio from '../../audio/context'
import * as React from 'react'

import BaseNode from './BaseNode'
import Radio from '../controls/Radio'
import Slider from '../controls/Slider'
import { useGraphStore } from '../../hooks/useGraphStore'

// CONSTANTS -------------------------------------------------------------------

const name = 'filter'
const info = (
    <p>
        A filter removes frequencies over a <strong>threshold</strong> value.
    </p>
)

const inputs = ['', '.frequency', '.detune', '.Q', '.gain']
const outputs = ['']

export const defaults = {
    frequency: 300,
    detune: 0,
    Q: 0.1,
    gain: 1,
    type: 'lowpass',
}

// COMPONENTS ------------------------------------------------------------------

export default function FilterNode({ id, data = defaults }) {
    const updateNode = useGraphStore((state) => state.updateNode)

    return (
        <BaseNode name={name} info={info} inputs={inputs} outputs={outputs}>
            <Slider
                label="frequency"
                value={data.frequency}
                min={10}
                max={10000}
                step={1}
                formatter={(val) => `${val} Hz`}
                onValueChange={([val]) =>
                    updateNode(id, { ...data, frequency: val })
                }
            />
            <Slider
                label="detune"
                value={data.detune}
                min={-100}
                max={100}
                step={1}
                formatter={(val) => `${val} cents`}
                onValueChange={([val]) =>
                    updateNode(id, { ...data, detune: val })
                }
            />
            <Slider
                label="Q"
                value={data.Q}
                min={0.0001}
                max={1000}
                step={0.0001}
                onValueChange={([val]) =>
                    updateNode(id, { ...data, Q: val })
                }
            />
            <Slider
                label="gain"
                value={data.gain}
                min={-0.5}
                max={2}
                step={0.01}
                onValueChange={([val]) =>
                    updateNode(id, { ...data, gain: val })
                }
            />
            <Radio
                label="waveform"
                value={data.waveform}
                options={[
                    'lowpass',
                    'highpass',
                    'bandpass',
                    'lowshelf',
                    'peaking',
                    'notch',
                    'allpass',
                ]}
                onValueChange={(val) =>
                    updateNode(id, { ...data, filterType: val })
                }
            />
        </BaseNode>
    )
}

// CONSTUCTORS -----------------------------------------------------------------

export const asReactFlowNode = (id, data = defaults, opts = {}) => ({
    type: FilterNode.name,
    id,
    data,
    ...opts,
})

export const asAudioNodes = (id, data = defaults, connections = {}) => [
    Audio.keyed(
        id,
        Audio.node(
            'BiquadFilterNode',
            [
                Audio.param('frequency', data.frequency),
                Audio.param('detune', data.detune),
                Audio.param('Q', data.Q),
                Audio.param('gain', data.gain),
                Audio.property('type', data.filterType),
            ],
            connections?.[id] ?? []
        )
    ),
]
