import { useState, useEffect } from 'react'
import PromptCard from './components/PromptCard'
import { getRandomItem } from './utils/random'

/**
 * ======================================
 * PACK REGISTRY
 * ======================================
 */

const PACKS = {
  core: {
    label: 'Core Game Jam',
    path: 'core'
  },

  entrepreneurship: {
    label: 'Entrepreneurship Workshop',
    path: 'entrepreneurship'
  }
}

/**
 * ======================================
 * SAFE JSON FETCHER
 * ======================================
 */

const safeFetchJSON = async (url) => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      console.warn(`Missing file: ${url}`)
      return []
    }

    return await response.json()

  } catch (error) {
    console.warn(`Failed loading: ${url}`, error)
    return []
  }
}

/**
 * ======================================
 * EMPTY DATA SHAPE
 * ======================================
 */

const createEmptyData = () => ({
  skills: [],
  theories: [],
  mechanics: [],
  gameTypes: [],
  chaos: []
})

const createEmptyState = () => ({
  skill: null,
  theory: null,
  mechanic: null,
  gameType: null,
  chaos: null
})

const createEmptyLocks = () => ({
  skill: false,
  theory: false,
  mechanic: false,
  gameType: false,
  chaos: false
})

export default function App() {

  /**
   * ======================================
   * ACTIVE PACK
   * ======================================
   */

  const [pack, setPack] = useState('core')

  /**
   * ======================================
   * PACK DATA
   * ======================================
   */

  const [data, setData] = useState(createEmptyData())

  /**
   * ======================================
   * GENERATED RESULTS
   * ======================================
   */

  const [state, setState] = useState(createEmptyState())

  /**
   * ======================================
   * LOCK SYSTEM
   * ======================================
   */

  const [locks, setLocks] = useState(createEmptyLocks())

  /**
   * ======================================
   * LOAD PACK
   * ======================================
   */

  useEffect(() => {

    const loadPack = async () => {

      const base = `${import.meta.env.BASE_URL}data/packs/${PACKS[pack].path}`

      const [
        skills,
        theories,
        mechanics,
        gameTypes,
        chaos
      ] = await Promise.all([
        safeFetchJSON(`${base}/skills.json`),
        safeFetchJSON(`${base}/theories.json`),
        safeFetchJSON(`${base}/mechanics.json`),
        safeFetchJSON(`${base}/gameTypes.json`),

        // optional module
        safeFetchJSON(`${base}/chaos.json`)
      ])

      setData({
        skills,
        theories,
        mechanics,
        gameTypes,
        chaos
      })


      // reset session cleanly
      setState(createEmptyState())
      setLocks(createEmptyLocks())
    }

    loadPack()

  }, [pack])

  /**
   * ======================================
   * GENERATION ENGINE
   * ======================================
   */

  const generate = (type, dataset) => {

    if (locks[type]) return

    if (!Array.isArray(dataset) || dataset.length === 0) {
      console.warn(`No dataset found for ${type}`)
      return
    }

    setState(prev => ({
      ...prev,
      [type]: getRandomItem(dataset)
    }))
  }

  const generateAll = () => {
    generate('skill', data.skills)
    generate('theory', data.theories)
    generate('mechanic', data.mechanics)
    generate('gameType', data.gameTypes)

    }

  /**
   * ======================================
   * LOCK TOGGLE
   * ======================================
   */

  const toggleLock = (type) => {
    setLocks(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  /**
   * ======================================
   * CHAOS GENERATOR
   * ======================================
   */

  const generateChaos = () => {
    generate('chaos', data.chaos)
  }

  /**
   * ======================================
   * EXPORT SUMMARY
   * ======================================
   */

  const generateSummaryText = () => `
POCKET PEDAGOGY — GAME JAM BRIEF

COMPETENCY
${state.skill?.name || '—'}

THEORY
${state.theory?.name || '—'}

MECHANIC
${state.mechanic?.name || '—'}

GAME TYPE
${state.gameType?.name || '—'}

CHAOS
${state.chaos?.name || '—'}

────────────────────────

DESCRIPTIONS

COMPETENCY
${state.skill?.description || '—'}

THEORY
${state.theory?.description || '—'}

MECHANIC
${state.mechanic?.description || '—'}

GAME TYPE
${state.gameType?.description || '—'}

CHAOS
${state.chaos?.description || '—'}

────────────────────────

Generated using Pocket Pedagogy
  `.trim()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateSummaryText())
    alert('Workshop brief copied!')
  }

  /**
   * ======================================
   * OPTIONAL MODULE FLAGS
   * ======================================
   */

  const hasChaos = data.chaos.length > 0

  /**
   * ======================================
   * UI
   * ======================================
   */

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <div className="max-w-5xl mx-auto space-y-4">

        {/* HEADER */}

        <div className="bg-black text-white rounded-2xl p-5 shadow">

          <h1 className="text-2xl font-bold">
            Pocket Pedagogy: Game Jam Engine
          </h1>

          <p className="text-sm opacity-80 mt-2">
            Generate structured educational game design prompts for workshops, classrooms, and rapid ideation.
          </p>

        </div>

        {/* HOW TO USE */}

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">

          <h2 className="font-bold text-sm uppercase tracking-wide text-gray-900">
            How To Use
          </h2>

          <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">

            <li>
              Use <strong>Generate All Categories</strong> to create a complete design prompt.
            </li>

            <li>
              Use category buttons to reroll only one part of the concept.
            </li>

            <li>
              Lock categories to preserve useful ideas while refining others.
            </li>

            <li>
              Optional chaos events can introduce constraints, surprises, or facilitation challenges.
            </li>

          </ul>

        </div>

        {/* PACK SWITCHER */}

        <div className="bg-white rounded-2xl shadow p-4 space-y-3">

          <h2 className="font-bold">
            Select Pack
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

            {Object.entries(PACKS).map(([key, value]) => (

              <button
                key={key}
                onClick={() => setPack(key)}
                className={`
                  py-3 px-4 rounded-xl font-bold transition

                  ${pack === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'}
                `}
              >
                {value.label}
              </button>

            ))}

          </div>

        </div>

        {/* MAIN BUTTON */}

        <button
          onClick={generateAll}
          className="w-full bg-green-600 hover:bg-green-700 transition text-white py-5 rounded-2xl font-bold shadow"
        >
          GENERATE ALL CATEGORIES
        </button>

        {/* CARD GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <PromptCard
            title="Skill"
            prompt={state.skill}
            locked={locks.skill}
            onGenerate={() => generate('skill', data.skills)}
            onToggleLock={() => toggleLock('skill')}
          />

          <PromptCard
            title="Theory"
            prompt={state.theory}
            locked={locks.theory}
            onGenerate={() => generate('theory', data.theories)}
            onToggleLock={() => toggleLock('theory')}
          />

          <PromptCard
            title="Mechanic"
            prompt={state.mechanic}
            locked={locks.mechanic}
            onGenerate={() => generate('mechanic', data.mechanics)}
            onToggleLock={() => toggleLock('mechanic')}
          />

          <PromptCard
            title="Game Type"
            prompt={state.gameType}
            locked={locks.gameType}
            onGenerate={() => generate('gameType', data.gameTypes)}
            onToggleLock={() => toggleLock('gameType')}
          />

        </div>

        {/* CHAOS MODULE */}

        {hasChaos && (

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="font-bold text-red-900">
                  Chaos Module
                </h2>

                <p className="text-sm text-red-700">
                  Introduce an unexpected disruption or design constraint.
                </p>
              </div>

              <div className="text-3xl">
                👹
              </div>

            </div>

            <button
              onClick={generateChaos}
              className="w-full bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-xl font-bold"
            >
              SUMMON CHAOS
            </button>

            {state.chaos && (

              <div className="bg-white border border-red-100 rounded-xl p-4">

                <div className="font-bold text-red-900">
                  {state.chaos.name}
                </div>

                <div className="text-sm text-gray-700 mt-1">
                  {state.chaos.description}
                </div>

              </div>

            )}

          </div>

        )}

        {/* EXPORT */}

        <div className="bg-white rounded-2xl shadow p-5 space-y-3">

          <h2 className="font-bold">
            Session Summary
          </h2>

          <button
            onClick={copyToClipboard}
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl font-bold"
          >
            COPY SUMMARY
          </button>

          <pre className="text-xs bg-gray-100 rounded-xl p-4 overflow-auto max-h-96 whitespace-pre-wrap">
            {generateSummaryText()}
          </pre>

        </div>

      </div>

    </div>
  )
}