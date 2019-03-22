import React from 'react'
import { connect } from '../StateProvider'

import AsyncActionsHOC from '../hoc/AsyncActionsHOC'
import DataDisplayVisualContainer from './DataDisplay'
import Countdown from './Countdown'
import { TextInput } from '../controls/ControlledInput'

import { checkLoadingOrNonZero } from '../../api/utils'

import { POOL_STATES, DATA_LOAD_STRING, FIXED_DECIMAL_AMOUNT } from '../../globals'

const DepositToken = AsyncActionsHOC(TextInput)
const WithdrawMGNandDepositsFromBothPools = AsyncActionsHOC()

const showDataForState = (data, currState, stateExpected) => (data === DATA_LOAD_STRING || currState === stateExpected || !!Number(data))

const PoolData = ({
    // state,
    BALANCE,
    DX_MGN_POOL,
    POOL_STATES: { POOL1STATE, POOL2STATE },
    // dispatch
    setDepositAmount,
    withdrawDepositAndMGN,
    // misc
    hasClaimables1,
    hasClaimables2,
}) =>
    <>
        <h2>Mgn pool - {DX_MGN_POOL.POOL1.DEPOSIT_SYMBOL.toLowerCase()}/{DX_MGN_POOL.POOL1.SECONDARY_SYMBOL.toLowerCase()}</h2>
        <div className="poolContainer">
            <div className="poolInnerContainer">
                {/* POOL 1 */}
                <pre className="poolDataContainer data-pre-blue">
                    <h3>{DX_MGN_POOL.POOL1.DEPOSIT_TOKEN.toLowerCase()} [{DX_MGN_POOL.POOL1.DEPOSIT_SYMBOL.toLowerCase()}]</h3>
                    <p><span className="data-title">STATUS:</span> <strong>{POOL1STATE.toUpperCase()}</strong></p>
                    {DX_MGN_POOL.POOL1.POOLING_PERIOD_END !== DATA_LOAD_STRING && 
                        <p><span className="data-title">POOLING END TIME:</span> <span className="data-date">{new Date(DX_MGN_POOL.POOL1.POOLING_PERIOD_END * 1000).toLocaleString()}</span></p>}
                    <hr />
                    <p><span className="data-title">TOTAL POOL SHARE:</span> {DX_MGN_POOL.POOL1.TOTAL_SHARE}</p>
                    <p><span className="data-title">YOUR CONTRIBUTION:</span> {DX_MGN_POOL.POOL1.YOUR_SHARE}</p>
                    {/* <hr /> */}
                    {/* Only show if POOLING or in another state but with non-zero claimables */}
                    {showDataForState(DX_MGN_POOL.POOL1.TOTAL_CLAIMABLE_MGN, POOL1STATE, POOL_STATES.POOLING) 
                        && <p><span className="data-title">TOTAL CLAIMABLE MGN:</span> {DX_MGN_POOL.POOL1.TOTAL_CLAIMABLE_MGN}</p>}
                    {showDataForState(DX_MGN_POOL.POOL1.TOTAL_CLAIMABLE_DEPOSIT, POOL1STATE, POOL_STATES.POOLING) 
                        && <p><span className="data-title">TOTAL CLAIMABLE DEPOSIT:</span> {DX_MGN_POOL.POOL1.TOTAL_CLAIMABLE_DEPOSIT}</p>}
                    <hr />
                    <p><span className="data-title">[<strong>{DX_MGN_POOL.POOL1.DEPOSIT_SYMBOL}</strong>] WALLET BALANCE:</span> {DX_MGN_POOL.POOL1.DEPOSIT_SYMBOL === 'WETH' || DX_MGN_POOL.POOL1.DEPOSIT_SYMBOL === 'ETH' ? ((+DX_MGN_POOL.POOL1.TOKEN_BALANCE) + (+BALANCE)).toFixed(FIXED_DECIMAL_AMOUNT) : DX_MGN_POOL.POOL1.TOKEN_BALANCE}</p>
                    <hr />
                    {POOL1STATE === POOL_STATES.POOLING 
                        && <DepositToken
                            asyncAction={params => setDepositAmount({ poolNumber: 1, ...params })}
                            forceDisable={POOL1STATE !== POOL_STATES.POOLING}
                            info={DX_MGN_POOL.POOL1.DEPOSIT_SYMBOL === 'WETH' 
                                ? 
                                '[WETH] You may need to sign up to 3 TXs [Wrap, Approve, Deposit]' 
                                : 
                                `[${DX_MGN_POOL.POOL1.DEPOSIT_SYMBOL}] You may need to sign up to 2 TXs [Approve, Deposit]`}
                            title={`deposit [${DX_MGN_POOL.POOL1.DEPOSIT_TOKEN.toLowerCase()}]`}
                            {...DX_MGN_POOL}
                        />}
                    <Countdown POOLING_PERIOD_END={DX_MGN_POOL.POOL1.POOLING_PERIOD_END} />
                    {
                        // Non zero, claimable values?
                        hasClaimables1
                            &&
                        // Contract states must be final
                        POOL1STATE === POOL_STATES.MGN_UNLOCKED
                            && 
                        <DataDisplayVisualContainer
                            colour="greenGradient"
                            title={null}
                        >
                            {() =>
                                <WithdrawMGNandDepositsFromBothPools 
                                    asyncAction={() => withdrawDepositAndMGN('POOL1')}
                                    title="Withdraw"
                                    buttonText="Withdraw"
                                    buttonOnly
                                    info="Withdraw any of your MGN + Deposits"
                                />
                            }
                        </DataDisplayVisualContainer>
                    }
                </pre>
                {/* POOL 2 */}
                <pre className="poolDataContainer data-pre-purple">
                    <h3>{DX_MGN_POOL.POOL1.SECONDARY_TOKEN.toLowerCase()} [{DX_MGN_POOL.POOL1.SECONDARY_SYMBOL.toLowerCase()}]</h3>
                    <p><span className="data-title">STATUS:</span> <strong>{POOL2STATE.toUpperCase()}</strong></p>
                    {DX_MGN_POOL.POOL2.POOLING_PERIOD_END !== DATA_LOAD_STRING && 
                        <p><span className="data-title">POOLING END TIME:</span> <span className="data-date">{new Date(DX_MGN_POOL.POOL2.POOLING_PERIOD_END * 1000).toLocaleString()}</span></p>}
                    <hr />
                    <p><span className="data-title">TOTAL POOL SHARE:</span> {DX_MGN_POOL.POOL2.TOTAL_SHARE}</p>
                    <p><span className="data-title">YOUR CONTRIBUTION:</span> {DX_MGN_POOL.POOL2.YOUR_SHARE}</p>
                    {/* <hr /> */}
                    {/* Only show if POOLING or in another state but with non-zero claimables */}
                    {showDataForState(DX_MGN_POOL.POOL2.TOTAL_CLAIMABLE_MGN, POOL2STATE, POOL_STATES.POOLING) 
                        && <p><span className="data-title">TOTAL CLAIMABLE MGN:</span> {DX_MGN_POOL.POOL2.TOTAL_CLAIMABLE_MGN}</p>}
                    {showDataForState(DX_MGN_POOL.POOL2.TOTAL_CLAIMABLE_DEPOSIT, POOL2STATE, POOL_STATES.POOLING) 
                        && <p><span className="data-title">TOTAL CLAIMABLE DEPOSIT:</span> {DX_MGN_POOL.POOL2.TOTAL_CLAIMABLE_DEPOSIT}</p>}
                    <hr />
                    <p><span className="data-title">[<strong>{DX_MGN_POOL.POOL1.SECONDARY_SYMBOL}</strong>] WALLET BALANCE:</span> {DX_MGN_POOL.POOL1.SECONDARY_SYMBOL === 'WETH' ? ((+DX_MGN_POOL.POOL2.TOKEN_BALANCE) + (+BALANCE)).toFixed(FIXED_DECIMAL_AMOUNT) : DX_MGN_POOL.POOL2.TOKEN_BALANCE}</p>

                    <hr />
                    {POOL2STATE === POOL_STATES.POOLING 
                        && <DepositToken
                            asyncAction={params => setDepositAmount({ poolNumber: 2, ...params })}
                            forceDisable={POOL2STATE !== POOL_STATES.POOLING}
                            info={
                                DX_MGN_POOL.POOL1.SECONDARY_SYMBOL === 'WETH' ? 
                                '[WETH] You may need to sign up to 3 TXs [Wrap, Approve, Deposit]' : 
                                `[${DX_MGN_POOL.POOL1.SECONDARY_SYMBOL}] You may need to sign up to 2 TXs [Approve, Deposit]`
                            }
                            title={`deposit [${DX_MGN_POOL.POOL1.SECONDARY_TOKEN.toLowerCase()}]`}
                            {...DX_MGN_POOL}
                        />}
                    <Countdown POOLING_PERIOD_END={DX_MGN_POOL.POOL2.POOLING_PERIOD_END} />
                    {
                        // Non zero, claimable values?
                        hasClaimables2
                            &&
                        // Contract states must be final
                        POOL2STATE === POOL_STATES.MGN_UNLOCKED 
                            && 
                        <DataDisplayVisualContainer
                            colour="greenGradient"
                            title={null}
                        >
                            {() =>
                                <WithdrawMGNandDepositsFromBothPools 
                                    asyncAction={() => withdrawDepositAndMGN('POOL2')}
                                    title="Withdraw"
                                    buttonText="Withdraw"
                                    buttonOnly
                                    info="Withdraw any of your MGN + Deposits"
                                />
                            }
                        </DataDisplayVisualContainer>
                    }
                </pre>
            </div>
        </div>
    </>

const mapProps = ({
    state: {
        DX_MGN_POOL,
        INPUT_AMOUNT,
        USER: {
            BALANCE,
        },
    },
    setDepositAmount,
    setInputAmount,
    withdrawDepositAndMGN,
}) => ({
    BALANCE,
    DX_MGN_POOL,
    INPUT_AMOUNT,
    POOL_STATES: {
        POOL1STATE: DX_MGN_POOL.POOL1.CURRENT_STATE,
        POOL2STATE: DX_MGN_POOL.POOL2.CURRENT_STATE,
    },
    hasClaimables1: checkLoadingOrNonZero(
        DX_MGN_POOL.POOL1.TOTAL_CLAIMABLE_DEPOSIT, 
        DX_MGN_POOL.POOL1.TOTAL_CLAIMABLE_MGN,
    ),
    hasClaimables2: checkLoadingOrNonZero(
        DX_MGN_POOL.POOL2.TOTAL_CLAIMABLE_DEPOSIT, 
        DX_MGN_POOL.POOL2.TOTAL_CLAIMABLE_MGN,
    ),
    setDepositAmount,
    setInputAmount,
    withdrawDepositAndMGN,
})

export default connect(mapProps)(PoolData)
