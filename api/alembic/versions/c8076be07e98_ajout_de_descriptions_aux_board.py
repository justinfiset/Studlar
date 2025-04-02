"""Ajout de descriptions aux board

Revision ID: c8076be07e98
Revises: 3417cd21d875
Create Date: 2025-04-02 08:13:55.113837

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c8076be07e98'
down_revision: Union[str, None] = '3417cd21d875'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Board',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('positionX', sa.Integer(), nullable=True),
    sa.Column('positionY', sa.Integer(), nullable=True),
    sa.Column('sizeX', sa.Integer(), nullable=True),
    sa.Column('sizeY', sa.Integer(), nullable=True),
    sa.Column('owner_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Board_id'), 'Board', ['id'], unique=False)
    op.create_index(op.f('ix_Board_owner_id'), 'Board', ['owner_id'], unique=False)
    op.create_table('Task',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('list_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_Task_id'), 'Task', ['id'], unique=False)
    op.create_index(op.f('ix_Task_list_id'), 'Task', ['list_id'], unique=False)
    op.create_table('TaskList',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('board_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_TaskList_board_id'), 'TaskList', ['board_id'], unique=False)
    op.create_index(op.f('ix_TaskList_id'), 'TaskList', ['id'], unique=False)
    op.create_table('User',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('firstname', sa.String(), nullable=True),
    sa.Column('lastname', sa.String(), nullable=True),
    sa.Column('password', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_User_email'), 'User', ['email'], unique=True)
    op.create_index(op.f('ix_User_id'), 'User', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_User_id'), table_name='User')
    op.drop_index(op.f('ix_User_email'), table_name='User')
    op.drop_table('User')
    op.drop_index(op.f('ix_TaskList_id'), table_name='TaskList')
    op.drop_index(op.f('ix_TaskList_board_id'), table_name='TaskList')
    op.drop_table('TaskList')
    op.drop_index(op.f('ix_Task_list_id'), table_name='Task')
    op.drop_index(op.f('ix_Task_id'), table_name='Task')
    op.drop_table('Task')
    op.drop_index(op.f('ix_Board_owner_id'), table_name='Board')
    op.drop_index(op.f('ix_Board_id'), table_name='Board')
    op.drop_table('Board')
    # ### end Alembic commands ###
