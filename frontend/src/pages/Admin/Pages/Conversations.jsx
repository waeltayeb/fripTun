import React from 'react'
import DefaultLayout from '../Layout/DefaultLayout';
import { Link } from 'react-router-dom'
import ChatAdmin from '../../../admin/chat/ChatAdmin';

function Conversations() {
    return (
        <DefaultLayout>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-black ">
                    Conversations
                </h2>

                <nav>
                    <ol className="flex items-center gap-2">
                        <li>
                            <Link className="font-medium" to="/">
                                Dashboard /
                            </Link>
                        </li>
                        <li className="font-medium text-primary">Conversations</li>
                    </ol>
                </nav>
            </div>
            <ChatAdmin />

        </DefaultLayout>
    );
}

export default Conversations
